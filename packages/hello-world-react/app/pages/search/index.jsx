import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import fetch from 'cross-fetch'
import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'

const IS_REMOTE = typeof process !== 'undefined' 

const Search = ({category, searchResults}) => {
    const [searchVal, setSearchVal] = useState('')
    const [categoryVal, setCategoryVal] = useState('root')

    return <div>
      Navigation: <Link to="/">Home</Link>

      <br />
      <br />
      Search term:&nbsp;
      <input type="text" onChange={(e) => {setSearchVal(e.target.value)}} value={searchVal} />
      <br />

      Category:&nbsp;
      <select name="categories" id="categories" value={categoryVal} onChange={(e) => {
        console.log('setting value to ', e.target.value)
        setCategoryVal(e.target.value)
      }}>
        <option key="all" value="root">All</option>
        {category && category.categories.map(({id, name}) => {
          return <option key={id} value={id}>{name}</option>
        })}
      </select>
      
      <br />

      <Link 
        to={`/search?q=${searchVal}&refine=${encodeURIComponent(`cgid=${categoryVal}`)}&cachebreaker=${Date.now()}`}
      >
        <button type="button">
          GO!
        </button>
      </Link>

      <br />
      <br />

      {searchResults && searchResults.total ?
        <div>
          Found {searchResults.total} Results Showing {searchResults.hits.length}:
          <ul>
            {searchResults.hits.map(({productId, productName}) => {
              return <li key={productId}>{productName}</li>
            })}
          </ul>
        </div> :
        <div>
          No results
        </div>
      }

      {!searchResults && 
        <div>Loading search results...</div>
      }
    </div>
}

Search.shouldGetProps = ({location, previousLocation}) => {
  return location?.search !== previousLocation?.search
}

Search.getProps = async ({location}) => {

    const uri = IS_REMOTE ? 
      'https://b2c-graphql-server-production.mobify-storefront.com/graphql' : 
      'http://localhost:4000/graphql'

    const params = new URLSearchParams(location.search)
    let q = params.get('q') || ''
    let refine = params.get('refine') || 'cgid=root'
    let cgid = refine.split('=')[1]
    console.log('getProps', cgid)
    const client = new ApolloClient({
      shouldBatch: true,
      uri: uri,
      fetch: fetch
    })

    // NOTE: There are potentially 2 scenarios. 
    // 1. we host and run a graphql server that has a set schema not 
    // allowing partners to change it. 
    // 2. we generate a graphql project that uses a base schema that we 
    // intend the developer will change/modify.
    //
    // The current implementation is the former, where you can imagine
    // the later having implemented a query in the server called `getSearchPageData`,
    // the benifit there is the way you can develop the "back-end" independently
    // of the front-end ui.
    const GET_CATEGORY_AND_PRODUCT = gql`
      query {
        getCategory(options: {parameters: {id: "root"}}) {
          id
          name
          categories {
            id,
            name
          }
        }
        productSearch(options: {parameters: {q: "${q}", refine: "cgid=${cgid}"}}) {
          hits {
            productId
            productName
          }
          total
        }
      }
    `

    const {data} = await client.query({
      query: GET_CATEGORY_AND_PRODUCT
    })

    console.log('productSearch: ', data.productSearch)
    return {
      category: data.getCategory,
      searchResults: data.productSearch
    }
}

export default Search
