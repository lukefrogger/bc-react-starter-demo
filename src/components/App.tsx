import * as React from "react";
import { Global, css, ThemeProvider } from '@emotion/react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { theme, Banner } from 'unsafe-bc-react-components';
import emotionReset from 'emotion-reset';
import { CommerceProvider } from '@bigcommerce/storefront-data-hooks'

import Cart from "../pages/cart";
import Category from "../pages/category";
import Home from "../pages/home";
import KitchenSink from "../pages/kitchen-sink";
import Product from "../pages/product";
import useBanners from "../hooks/useBanners";

export default function App() {  
  const { banner, onBannerClose } = useBanners()

  return (
    <CommerceProvider locale={'en-US'}>
      <ThemeProvider theme={theme}>
        <Global
          styles={css`
            @import url('https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;900&family=Red+Hat+Text:wght@400;700&display=swap');
            ${emotionReset}
            *, *::after, *::before {
              box-sizing: border-box;
              -moz-osx-font-smoothing: grayscale;
              -webkit-font-smoothing: antialiased;
            }
            body {
              ${theme?.typography?.body as any}
            }
          `}
        />
        <Router>
          <div style={{ marginTop: banner ? 48 : 0 }}>
            {banner && (
              <Banner onClose={onBannerClose}>{banner?.content}</Banner>
            )}
            <Header />
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/category/:slug">
                <Category />
              </Route>
              <Route path="/product/:slug">
                <Product />
              </Route>
              <Route path="/cart">
                <Cart />
              </Route>
              <Route path="/kitchen-sink">
                <KitchenSink />
              </Route>
            </Switch>
          </div>
        </Router>
      </ThemeProvider>
    </CommerceProvider>
  );
}

function Header() {
  return (
    <div>
      <p style={{ backgroundColor: "blue", width: "100%", height: 80, color: 'white', fontSize: 32, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Header</p>
    </div>
  );
}
