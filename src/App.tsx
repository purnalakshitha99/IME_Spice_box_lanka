import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { ProductDetailsPage } from './pages/ProductDetailsPage'
import { GiftBuilderPage } from './pages/GiftBuilderPage'
import { RecommendPage } from './pages/RecommendPage'
import { CorporatePage } from './pages/CorporatePage'
import { OurStoryPage } from './pages/OurStoryPage'
import { StoriesPage, StoryDetailPage, QrLandingPage } from './pages/StoriesPage'
import { RecipesPage, RecipeDetailPage } from './pages/RecipesPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { TrackPage } from './pages/TrackPage'
import { AccountPage, WishlistPage } from './pages/AccountPage'
import { ContactPage, FAQPage } from './pages/ContactPage'
import { AdminPage } from './pages/AdminPage'
import { BuildYourSpiceBoxPage } from './pages/BuildYourSpiceBoxPage'
import { ExperiencePage } from './pages/ExperiencePage'
import { GiftBoxDetailsPage, GiftBoxesPage } from './pages/GiftBoxesPage'
import { OrderSuccessPage } from './pages/OrderSuccessPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="products" element={<ShopPage />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
          <Route path="products/:id" element={<ProductDetailsPage />} />
          <Route path="gift-box/:id" element={<ProductDetailsPage />} />
          <Route path="gift-builder" element={<GiftBuilderPage />} />
          <Route path="build-your-spicebox" element={<BuildYourSpiceBoxPage />} />
          <Route path="gift-boxes" element={<GiftBoxesPage />} />
          <Route path="gift-boxes/:id" element={<GiftBoxDetailsPage />} />
          <Route path="experience/:productId" element={<ExperiencePage />} />
          <Route path="recommend" element={<RecommendPage />} />
          <Route path="corporate" element={<CorporatePage />} />
          <Route path="corporate-gifting" element={<CorporatePage />} />
          <Route path="our-story" element={<OurStoryPage />} />
          <Route path="stories" element={<StoriesPage />} />
          <Route path="stories/:slug" element={<StoryDetailPage />} />
          <Route path="qr/:id" element={<QrLandingPage />} />
          <Route path="recipes" element={<RecipesPage />} />
          <Route path="recipes/:id" element={<RecipeDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route path="track" element={<TrackPage />} />
          <Route path="track-order" element={<TrackPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="login" element={<AccountPage />} />
          <Route path="register" element={<AccountPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
