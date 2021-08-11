import * as React from 'react'

import useOrderProducts, {
  Products,
} from '@bigcommerce/storefront-data-hooks/use-order-products'
import { useTranslation } from 'react-i18next'
import { Link, useHistory, useParams } from 'react-router-dom'
import {
  Button,
  Orders,
  ProductRow,
  Typography,
} from 'unsafe-bc-react-components'

import { Arrow } from '@components/header/icons'
import { useOrder } from '@hooks/order'

import * as styles from './styles'

export function OrderPage(): React.ReactElement {
  const { t } = useTranslation()
  const history = useHistory()
  const { slug }: { slug: string } = useParams()
  const { data: order, error: orderError } = useOrder(Number(slug))
  const { data: products, error: productsError } = useOrderProducts({
    orderId: Number(slug),
  })
  const isLoading = !order && !orderError
  const isProductsLoading = !products && !productsError

  const handleRedirectToProduct = (product: Products[0]): void => {
    history.push(`/product/${product.id}`)
    window.scrollTo(0, 0)
  }

  const handleContactSupport = (): void => {
    window.open('mailto:support@bc.com')
  }

  if (!isLoading && !order) {
    return (
      <div css={styles.Container}>
        <div css={styles.Header}>
          <Typography css={styles.Title} variant="display-large">
            {t('order.not_found', 'No order found')}
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div css={styles.Container}>
      <div css={styles.Header}>
        <Typography css={styles.Title} variant="display-large">
          {t('order.title', 'Order')} #{slug}
        </Typography>
        <Link css={styles.Link} to="/user/orders">
          <Arrow orientation="left" />
          {t('order.back_to_list', 'Back to orders')}
        </Link>
      </div>
      <>
        <div css={styles.Grid}>
          <div css={styles.List}>
            {isProductsLoading ? (
              <div>Loading...</div>
            ) : (
              products?.map((product) => (
                // TODO: Order from API missing some data: salePrice, product image
                <ProductRow
                  key={product.id}
                  image={{
                    src: 'https://cdn11.bigcommerce.com/s-wrur4yohpn/images/stencil/500w/products/77/266/foglinenbeigestripetowel1b.1626110985.jpg',
                  }}
                  onClick={() => handleRedirectToProduct(product)}
                  name={product.name ?? ''}
                  prices={{
                    price: Number(product.total_inc_tax) ?? 0,
                    salePrice: 0,
                    currencySettings: { currency: order?.currency_code },
                  }}
                  quantity={{ quantity: product.quantity ?? 5 }}
                  editable={false}
                />
              ))
            )}
            <Button
              onClick={handleContactSupport}
              css={styles.Button}
              variant="tertiary"
            >
              {t('order.contact_support', 'Contact support')}
            </Button>
          </div>
          {isLoading
            ? 'Loading...'
            : order && (
                <Orders.OrderDetail css={styles.Detail} order={order as any} />
              )}
        </div>
      </>
    </div>
  )
}
