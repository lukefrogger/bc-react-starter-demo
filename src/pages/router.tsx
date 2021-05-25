import * as React from 'react'

import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Footer, Header } from '@components'
import { CartPage, CategoryPage, HomePage, ProductPage } from '@pages'

export function Router(): React.ReactElement {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/category/:slug">
            <CategoryPage />
          </Route>
          <Route path="/product/:slug">
            <ProductPage />
          </Route>
          <Route path="/cart">
            <CartPage />
          </Route>
        </Switch>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
