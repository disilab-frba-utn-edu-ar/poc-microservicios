import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, NavLink } from 'react-router-dom';
import { useAdminCheck } from '../hooks/useAdminCheck';

const Navbar = () => {
    const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
    const { isAdmin } = useAdminCheck();

    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
                    DDS-CART
                </Link>
                <div className="flex items-center space-x-4">
                    {isAuthenticated && (
                        <>
                            <NavLink to="/cart" className={({ isActive }) => `text-gray-600 hover:text-blue-600 ${isActive ? 'font-bold' : ''}`}>
                                Cart
                            </NavLink>
                            {isAdmin && (
                                <NavLink to="/admin" className={({ isActive }) => `text-gray-600 hover:text-blue-600 ${isActive ? 'font-bold' : ''}`}>
                                    Admin
                                </NavLink>
                            )}
                        </>
                    )}


                    {isLoading ? (
                        <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-blue-500"></div>
                    ) : isAuthenticated ? (
                        <div className="flex items-center space-x-2">
                            <span className="text-sm">Hi, {user.given_name || user.name}!</span>
                            <button
                                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 text-sm rounded-md transition"
                            >
                                Log Out
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => loginWithRedirect()}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 text-sm rounded-md transition"
                        >
                            Log In
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;