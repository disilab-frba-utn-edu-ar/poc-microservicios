import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LandingPage = () => {
    const { loginWithRedirect, isLoading } = useAuth0();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center max-w-2xl mx-auto px-6">
                {/* Logo/Brand */}
                <div className="mb-8">
                    <h1 className="text-6xl md:text-8xl font-bold text-blue-600 mb-4">
                        DDS-CART
                    </h1>
                    <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
                </div>

                {/* Description */}
                <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                        Tu Carrito de Compras Digital
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Una plataforma moderna para gestionar tus productos y carrito de compras. 
                        Inicia sesión para comenzar a explorar nuestros productos.
                    </p>
                </div>

                {/* Login Button */}
                <div className="space-y-4">
                    <button
                        onClick={() => loginWithRedirect()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Iniciar Sesión
                    </button>
                    
                    <div className="text-sm text-gray-500">
                        Accede con tu cuenta para continuar
                    </div>
                </div>

                {/* Features */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Productos</h3>
                        <p className="text-sm text-gray-600">Explora nuestro catálogo de productos</p>
                    </div>
                    
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Carrito</h3>
                        <p className="text-sm text-gray-600">Gestiona tus compras fácilmente</p>
                    </div>
                    
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Seguro</h3>
                        <p className="text-sm text-gray-600">Autenticación segura con Auth0</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
