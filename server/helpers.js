import addressesApi, {
  handlers as addressesApiHandlers,
} from '@bigcommerce/storefront-data-hooks/api/address'
import cartApi from '@bigcommerce/storefront-data-hooks/api/cart'
import catalogProductsApi, {
  handlers as catalogProductsApiHandlers,
} from '@bigcommerce/storefront-data-hooks/api/catalog/products'
import loginApiHandlers from '@bigcommerce/storefront-data-hooks/api/customers/handlers/login'
import customersApi from '@bigcommerce/storefront-data-hooks/api/customers/login'
import axios from 'axios'
import csc from 'country-state-city'

export const onStoreProxyReq = (proxyReq, req, res) => {
  proxyReq.setHeader(
    'X-Auth-Client',
    process.env.BIGCOMMERCE_STORE_API_CLIENT_ID
  )
  proxyReq.setHeader('X-Auth-Token', process.env.BIGCOMMERCE_STORE_API_TOKEN)
}

export const getAddressHelper = async (req, res) => {
  return addressesApi({
    operations: {
      getAddresses: (handler) => {
        addressesApiHandlers.getAddresses(handler)
      },
    },
  })(req, res)
}

export const getProductHelper = async (req, res) => {
  const body = req.query

  return catalogProductsApi({
    operations: {
      getProducts: (handler) => {
        catalogProductsApiHandlers.getProducts({
          ...handler,
          body,
        })
      },
    },
  })(req, res)
}

export const getLoginHelper = async (req, res) => {
  const { email, password } = req.body

  customersApi({
    operations: {
      login: ({ ...handler }) => {
        loginApiHandlers({
          ...handler,
          body: { email, password },
        })
      },
    },
  })(req, res)
}

export const cartHelper = async (req, res) => {
  const [first, cartId, ...rest] = req.url.split('/')
  const handler = await cartApi.default()
  req.cookies = { bc_cartId: cartId || null }
  const cart = await handler(req, res, cartApi.handlers)
  res.end()
}

export const countryHelper = (req, res) => {
  const data = csc.default.getAllCountries().map((country) => {
    const { name, isoCode } = country
    return { name, sortname: name, id: isoCode }
  })
  res.write(JSON.stringify(data))
  res.end()
}

export const stateHelper = (req, res) => {
  const [host, code] = req.url.split('/')
  const states = csc.default.getStatesOfCountry(code)

  const data = states.map(({ name, isoCode }) => ({ name, id: isoCode }))
  res.write(JSON.stringify(data))
  res.end()
}

export const categoriesHelper = async (req, res) => {
  const { data } = await axios(process.env.BIGCOMMERCE_STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.BIGCOMMERCE_STOREFRONT_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      query: `query CategoryTree3LevelsDeep {
        site {
          categoryTree {
            ...CategoryFields
            children {
              ...CategoryFields
              children {
                ...CategoryFields
              }
            }
          }
        }
      }

      fragment CategoryFields on CategoryTreeItem {
        name
        path
        entityId
        description
        productCount
      }`,
    }),
  })

  res.end(JSON.stringify(data.data))
}