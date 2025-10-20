import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { setupInterceptors } from './services/api';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ProductListPage from './pages/ProductListPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from "./components/AdminRoute.jsx";

function App() {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    useEffect(() => {
        if (isAuthenticated) {
            setupInterceptors(getAccessTokenSilently);
        }

    }, [isAuthenticated, getAccessTokenSilently]);

    return (
        <Router>
            <div className="bg-gray-100 min-h-screen font-sans">
                {isAuthenticated && <Navbar />}
                <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
                <main className={isAuthenticated ? "container mx-auto p-4 md:p-8" : ""}>
                    <Routes>
                        <Route path="/" element={isAuthenticated ? <ProductListPage /> : <LandingPage />} />
                        <Route path="/cart" element={<ProtectedRoute component={CartPage} />} />
                        <Route path="/admin" element={<AdminRoute component={AdminPage} />} />
                        <Route path="/order-success" element={<ProtectedRoute component={OrderSuccessPage} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;