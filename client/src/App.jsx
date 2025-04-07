import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Navbar from './Components/Navbar';
import Updateitem from './pages/updateproductforadmin'
import About from './pages/About';
import Blog from './pages/blog';
import Login from './pages/loginuser';
import Contact from './pages/Contact';
import Updateuser from './pages/edituser';
import Allproducts from './pages/allproducts';
import Cart from './pages/cart';
import CreateAccount from './pages/createaccount';
import Checkout from './pages/checkout';
import UserProfile from './pages/userprofile';
import UserDetail from './pages/userdetial';
import AddNewProduct from './pages/addproductforadmin';
import Shop from './pages/shop';
import ProductDetail from './pages/productdet';
import Allusersforadmin from './pages/allusersforadmin';
import Dashboard from './pages/dashboard';
import Addminprofile from './pages/addminprofile';
import Allproductsforadmin from './pages/allproductsforadmin';
import Allorders from './pages/allorders';
import { CartProvider } from './Components/cartcontext';
import './project.css';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  useEffect(() => {
    if (!token || !isLoggedIn) {
      navigate("/login");
      return;
    }

    if (adminOnly && role !== "admin") {
      navigate("/");
      return;
    }
  }, [navigate, adminOnly, token, role, isLoggedIn]);

  return children;
};

export default function App() {
  return (
    
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/updateitem/:id" element={<Updateitem />} />
            <Route path="/allproducts" element={<Allproducts />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/createaccount" element={<CreateAccount />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/productdetail/:id" element={<ProductDetail />} />

            {/* Protected User Routes */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/userdetail/:id"
              element={
                <UserDetail />
              }
            />
            <Route
              path="/userprofile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/updateUser/:id"
              element={
                <ProtectedRoute>
                  <Updateuser />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addminprofile"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Addminprofile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/allproductsforadmin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Allproductsforadmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/allusersforadmin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Allusersforadmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/allorders"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Allorders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addnewproduct"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AddNewProduct />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
  );
}