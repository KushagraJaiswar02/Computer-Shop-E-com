import { BrandDocumentTitle } from './components/layout/BrandDocumentTitle';
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
            <Route element={<StoreLayout />}>
              <Route index element={<HomePage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="category/:categoryId" element={<CategoryPage />} />
              <Route path="category/:categoryId/:subcategoryId" element={<CategoryPage />} />
              <Route path="brand/:brandId" element={<BrandPage />} />
              <Route path="brand/:brandId/:seriesId" element={<BrandPage />} />
              <Route path="brands" element={<BrandsPage />} />
              <Route path="brands/:brandSlug" element={<BrandPage />} />
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
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route element={<ProtectedAccountRoute />}>
                <Route path="account" element={<AccountPage />}>
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
