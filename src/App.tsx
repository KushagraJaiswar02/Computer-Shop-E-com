import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { StoreLayout } from './components/layout/StoreLayout';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoryPage } from './pages/CategoryPage';
import { BrandPage } from './pages/BrandPage';
import { BrandsPage } from './pages/BrandsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { ComparePage } from './pages/ComparePage';
import { EnquiryPage } from './pages/EnquiryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { AccountPage } from './pages/AccountPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardOverview } from './pages/admin/AdminDashboardOverview';
import { AdminHomepageBuilderPage } from './pages/admin/AdminHomepageBuilderPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesBrandsPage } from './pages/admin/AdminCategoriesBrandsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer Storefront Routes */}
          <Route element={<StoreLayout />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="category/:categoryId" element={<CategoryPage />} />
            <Route path="category/:categoryId/:subcategoryId" element={<CategoryPage />} />
            <Route path="brand/:brandId" element={<BrandPage />} />
            <Route path="brand/:brandId/:seriesId" element={<BrandPage />} />
            <Route path="brands" element={<BrandsPage />} />
            <Route path="product/:slug" element={<ProductDetailPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="compare" element={<ComparePage />} />
            <Route path="enquiry" element={<EnquiryPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="policies" element={<PoliciesPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="account/:subpage" element={<AccountPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Auth Pages (Clean distraction-free layouts) */}
          <Route path="auth/login" element={<LoginPage />} />
          <Route path="auth/register" element={<RegisterPage />} />

          {/* Admin Dashboard Routes */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardOverview />} />
            <Route path="homepage-builder" element={<AdminHomepageBuilderPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesBrandsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="enquiries" element={<AdminEnquiriesPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
};

export default App;
