import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';

const LandingPage = () => {
    const { loginWithRedirect, isLoading } = useAuth0();
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiClient.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="text-3xl font-bold text-blue-600 hover:text-blue-800">
                            DDS-CART
                        </Link>

                        <button
                            onClick={() => loginWithRedirect()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-8 animated-gradient">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        ¡Bienvenido a DDS-CART!
                    </h1>
                    <p className="text-lg md:text-xl mb-6 opacity-90">
                        Descubre productos increíbles y gestiona tu carrito de compras de manera inteligente
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-4 py-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Envío rápido</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-4 py-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>Compra segura</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-4 py-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>Calidad garantizada</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8">
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Productos Destacados</h2>
                        <div className="text-sm text-gray-600">
                            {products.length} productos disponibles
                        </div>
                    </div>

                    {loadingProducts ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-blue-500"></div>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.slice(0, 8).map((product) => (
                                <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group product-card">
                                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                        {product.imageUrl ? (
                                            <img 
                                                src={`${import.meta.env.VITE_API_BASE_URL}${product.imageUrl}`}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold text-blue-600">
                                                ${product.price.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <div className="flex items-center space-x-2 text-blue-700">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                                <span className="text-sm font-medium">Inicia sesión para comprar</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay productos disponibles</h3>
                            <p className="text-gray-600">Los productos aparecerán aquí cuando estén disponibles.</p>
                        </div>
                    )}
                </section>

                <section className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        ¿Listo para comenzar a comprar?
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Inicia sesión para acceder a todas las funcionalidades: agregar productos al carrito, 
                        gestionar tu lista de compras y realizar pedidos de forma segura.
                    </p>
                    <button
                        onClick={() => loginWithRedirect()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Iniciar Sesión Ahora
                    </button>
                </section>
            </main>

            <footer className="bg-gray-800 text-white py-8 mt-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">DDS-CART</h3>
                            <p className="text-gray-300 text-sm">
                                Tu plataforma de confianza para gestionar productos y carritos de compras de manera inteligente.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Funcionalidades</h3>
                            <ul className="text-gray-300 text-sm space-y-2">
                                <li>• Catálogo de productos</li>
                                <li>• Carrito de compras</li>
                                <li>• Gestión de pedidos</li>
                                <li>• Autenticación segura</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Seguridad</h3>
                            <div className="flex items-center space-x-2 text-gray-300 text-sm">
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>Protegido con Auth0</span>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
                        <p>&copy; Catedra Diseño de Sistemas de Información.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
