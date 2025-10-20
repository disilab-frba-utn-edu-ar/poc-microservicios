import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, NavLink } from 'react-router-dom';
import { useAdminCheck } from '../hooks/useAdminCheck';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
    const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
    const { isAdmin } = useAdminCheck();
    const { cartCount } = useCart();

    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
                    DDSI-CART
                </Link>
                <div className="flex items-center space-x-4">
                    {isAuthenticated && (
                        <>
                            <NavLink 
                                to="/cart" 
                                className={({ isActive }) => `relative text-gray-600 hover:text-blue-600 transition-colors ${isActive ? 'font-bold' : ''}`}
                            >
                                <div className="flex items-center space-x-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                                    </svg>
                                    <span className="hidden sm:inline">Carrito</span>
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </div>
                            </NavLink>
                            
                            {isAdmin && (
                                <NavLink to="/admin" className={({ isActive }) => `text-gray-600 hover:text-blue-600 ${isActive ? 'font-bold' : ''}`}>
                                    Crear producto
                                </NavLink>
                            )}
                        </>
                    )}


                    {isLoading ? (
                        <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-blue-500"></div>
                    ) : isAuthenticated ? (
                        <div className="flex items-center space-x-2">
                            <span className="text-sm">Hola, {user.given_name || user.name}!</span>
                            <button
                                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 text-sm rounded-md transition"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => loginWithRedirect()}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 text-sm rounded-md transition"
                        >
                            Iniciar sesión
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;