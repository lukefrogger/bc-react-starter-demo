import * as React from 'react'

import { useTranslation } from 'react-i18next'
import { DialogDisclosure } from 'reakit/Dialog'
import {
  Button,
  ProductPrice,
  // ProductReview,
  QuantitySelector,
  // StarRating,
  Typography,
} from 'unsafe-bc-react-components'

import { Breadcrumbs, WishlistItemDialog } from '@components'
import { useAddCartItem, useProduct, useWishlistDialog } from '@hooks'
import { getCurrentVariant, getProductOptions } from '@utils'

import * as styles from './styles'

type ProductPageProps = {
  slug: string
  isLimited?: boolean
}

export function ProductPage({
  slug,
  isLimited,
}: ProductPageProps): React.ReactElement {
  const { t } = useTranslation()

  const { data: product } = useProduct(slug)

  const options = getProductOptions(product)
  const [choices, setChoices] = React.useState<any>({})
  const variant = getCurrentVariant(product, choices)

  const { addCartItem, isAdding, setQuantity, quantity } = useAddCartItem({
    productId: product?.entityId,
    variantId: variant?.node.entityId,
  })

  const wishlistDialog = useWishlistDialog({
    productId: product?.entityId,
    variantId: variant?.node.entityId,
  })

  if (!product) return <p>Loading</p>

  const description = (
    <Typography
      variant="body-small"
      dangerouslySetInnerHTML={{ __html: product.description }}
    />
  )

  return (
    <div css={styles.container}>
      {!isLimited && (
        <Breadcrumbs>
          <Breadcrumbs.Item to="/">
            {t('breadcrumbs.home', 'Home')}
          </Breadcrumbs.Item>
          {/* TODO: Add Category to Breadcrumbs */}
          <Breadcrumbs.Item>{product?.name}</Breadcrumbs.Item>
        </Breadcrumbs>
      )}
      <div css={styles.grid(isLimited)}>
        <div css={styles.image(isLimited)} />
        <div css={styles.product}>
          <div css={styles.productDescription}>
            <Typography variant="overline">
              {product.brand?.name.toUpperCase()}
            </Typography>
            <Typography variant="display">{product.name}</Typography>
            <ProductPrice
              price={variant.node.prices.basePrice.value}
              salePrice={variant.node.prices.salePrice?.value || 0}
              currencySettings={{
                currency: variant.node.prices.basePrice.code,
              }}
            />
            {!isLimited && description}
            {/*             <div css={styles.starRow}>
              <StarRating
                rating={4}
                style={{ marginTop: 0, marginBottom: 0 }}
              />
              <Typography variant="body-small">2 reviews</Typography>
            </div> */}
            <div>
              <DialogDisclosure {...wishlistDialog} css={styles.link}>
                Add to wishlist
              </DialogDisclosure>
              <WishlistItemDialog {...wishlistDialog} />
            </div>
          </div>
          <div css={styles.productOptions}>
            {options?.map((opt: any) => (
              <div key={opt.displayName}>
                <Typography variant="display-xx-small">
                  {opt.displayName.toUpperCase()}
                </Typography>
                <div css={styles.row}>
                  {
                    // TODO: Improve legibility
                  }
                  {opt.values.map((v: any, i: number) => {
                    const active = (choices as any)[opt.displayName]
                    return (
                      <Button
                        variant={v.label === active ? 'secondary' : 'tertiary'}
                        key={v.label}
                        onClick={() => {
                          setChoices({
                            ...choices,
                            [opt.displayName]: v.label,
                          })
                        }}
                      >
                        {v.label}
                      </Button>
                    )
                  })}
                </div>
              </div>
            ))}
            <div>
              <Typography variant="display-xx-small">
                {t('bc.product.quantity', 'QUANTITY')}
              </Typography>
              <div css={styles.row}>
                <QuantitySelector
                  defaultQuantity={quantity}
                  onChangeQuantity={setQuantity}
                />
                <Button onClick={addCartItem} disabled={isAdding}>
                  {t('bc.cart.add_to_cart', 'Add to Cart')}
                </Button>
              </div>
            </div>
            {isLimited && description}
          </div>
        </div>
      </div>
      {!isLimited && (
        <div css={styles.productDetail}>
          <div css={styles.productDetailRow}>
            <Typography variant="display-small">
              {t('bc.product.description', 'Description')}
            </Typography>
            <Typography
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
          <div css={styles.productDetailRow}>
            <Typography variant="display-small">
              {t('bc.product.specifications', 'Specifications')}
            </Typography>
            <Typography
              dangerouslySetInnerHTML={{ __html: product.description }} // TODO: Change to specifications
            />
          </div>
          {/*         <div css={styles.productDetailRow}>
          <Typography variant="display-small">Reviews</Typography>
          <div css={styles.reviewList}>
            <ProductReview
              review={{
                author: productMock.review.name,
                rating: productMock.review.rating,
                date: new Date(productMock.review.date_modified),
                text: productMock.review.text,
                title: productMock.review.title,
              }}
              style={{ marginTop: 0 }}
            />
            <ProductReview
              review={{
                author: productMock.review.name,
                rating: productMock.review.rating,
                date: new Date(productMock.review.date_modified),
                text: productMock.review.text,
                title: productMock.review.title,
              }}
              style={{ marginTop: 0 }}
            />
            <ProductReview
              review={{
                author: productMock.review.name,
                rating: productMock.review.rating,
                date: new Date(productMock.review.date_modified),
                text: productMock.review.text,
                title: productMock.review.title,
              }}
              style={{ marginTop: 0 }}
            />
          </div>
        </div> */}
        </div>
      )}
      {/*       <Typography
        variant="display"
        css={css`
          text-align: center;
          padding: 48px 0;
        `}
      >
        You might also enjoy
      </Typography>
      <div css={styles.relatedProducts}>
        {products.map((relatedProduct) => (
          <ProductCard key={relatedProduct.id} {...relatedProduct} />
        ))}
      </div> */}
    </div>
  )
}
