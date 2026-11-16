import { BrandDocumentTitle } from './components/layout/BrandDocumentTitle';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { ResponsivePage, ResponsiveStoreLayout } from './components/layout/ResponsiveStoreLayout';

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
import { AuthProvider } from './features/account/useAuth';
import { ProtectedAccountRoute, LegacyAuthRedirect } from './features/account/ProtectedAccountRoute';
import { AccountDashboard } from './features/account/AccountDashboard';
import { AccountDetails } from './features/account/AccountDetails';
import { AccountOrders, AccountOrderDetail } from './features/account/AccountOrders';
import { AccountRequests } from './features/account/AccountRequests';
import { AccountAddresses } from './features/account/AccountAddresses';
import { accountConfig } from './config/account';


// Admin Pages
import { AdminGuard } from './pages/admin/AdminGuard';
import { AdminArchivePage } from './pages/admin/AdminArchivePage';
import { AdminHistoryPage } from './pages/admin/AdminHistoryPage';
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
        <AuthProvider>
          <BrandDocumentTitle />
          <Routes>
            {/* Customer Storefront Routes */}
            <Route element={<ResponsiveStoreLayout />}>
              <Route index element={<ResponsivePage screen="home" desktop={<HomePage />} />} />
              <Route path="shop" element={<ResponsivePage screen="shop" desktop={<ShopPage />} />} />
              <Route path="categories" element={<ResponsivePage screen="categories" desktop={<ShopPage />} />} />
              <Route path="category/:categoryId" element={<ResponsivePage screen="category" desktop={<CategoryPage />} />} />
              <Route path="category/:categoryId/:subcategoryId" element={<ResponsivePage screen="category" desktop={<CategoryPage />} />} />
              <Route path="brand/:brandId" element={<ResponsivePage screen="brand" desktop={<BrandPage />} />} />
              <Route path="brand/:brandId/:seriesId" element={<ResponsivePage screen="brand" desktop={<BrandPage />} />} />
              <Route path="brands" element={<ResponsivePage screen="brands" desktop={<BrandsPage />} />} />
              <Route path="brands/:brandSlug" element={<ResponsivePage screen="brand" desktop={<BrandPage />} />} />
              <Route path="product/:slug" element={<ResponsivePage screen="product" desktop={<ProductDetailPage />} />} />
              <Route path="wishlist" element={<ResponsivePage screen="wishlist" desktop={<WishlistPage />} />} />
              <Route path="cart" element={<ResponsivePage screen="cart" desktop={<CartPage />} />} />
              <Route path="checkout" element={<ResponsivePage screen="checkout" desktop={<CheckoutPage />} />} />
              <Route path="order-confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route path="compare" element={<ResponsivePage screen="compare" desktop={<ComparePage />} />} />
              <Route path="search" element={<ResponsivePage screen="search" desktop={<ShopPage />} />} />
              <Route path="enquiry" element={<EnquiryPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="policies" element={<PoliciesPage />} />
              <Route path="login" element={<ResponsivePage screen="login" desktop={<LoginPage />} />} />
              <Route path="register" element={<ResponsivePage screen="register" desktop={<RegisterPage />} />} />
              <Route element={<ProtectedAccountRoute />}>
                <Route path="account" element={<ResponsivePage screen="account" desktop={<AccountPage />} />}>
                  <Route index element={<AccountDashboard />} />
                  <Route path="details" element={<AccountDetails />} />
                  <Route path="profile" element={<Navigate to="/account/details" replace />} />
                  <Route path="orders" element={<AccountOrders />} />
                  <Route path="orders/:id" element={<AccountOrderDetail />} />
                  <Route path="requests" element={<AccountRequests />} />
                  {accountConfig.SHOW_ADDRESSES && <Route path="addresses" element={<AccountAddresses />} />}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Legacy authentication links */}
            <Route path="auth/login" element={<LegacyAuthRedirect to="/login" />} />
            <Route path="auth/register" element={<LegacyAuthRedirect to="/register" />} />

            {/* Admin Dashboard Routes */}
            <Route element={<AdminGuard />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardOverview />} />
              <Route path="homepage-builder" element={<AdminHomepageBuilderPage key="homepage" />} />
              <Route path="banners" element={<AdminHomepageBuilderPage key="banners" />} />
              <Route path="featured" element={<AdminHomepageBuilderPage key="featured" />} />
              <Route path="deals" element={<AdminHomepageBuilderPage key="deals" />} />
              <Route path="announcement" element={<AdminHomepageBuilderPage key="announcement" />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="categories" element={<AdminCategoriesBrandsPage />} />
              <Route path="brands" element={<AdminCategoriesBrandsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="enquiries" element={<AdminEnquiriesPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="history" element={<AdminHistoryPage />} />
              <Route path="archive" element={<AdminArchivePage />} />
            </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </StoreProvider>
  );
};

export default App;
