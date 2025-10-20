import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import apiClient from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiClient.get('/products');
                setProducts(response.data);
            } catch (error) {
                toast.error('Could not fetch products.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = async (productId) => {
        if (!isAuthenticated) {
            loginWithRedirect({ appState: { returnTo: window.location.pathname } });
            return;
        }

        try {
            await toast.promise(
                addToCart(productId, 1),
                {
                    pending: 'Agregando al carrito...',
                    success: '¡Producto agregado al carrito!',
                    error: 'No se pudo agregar el producto. El servicio puede estar fuera de línea.'
                }
            );
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Nuestros Productos
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Descubre nuestra amplia selección de productos de alta calidad. 
                        Encuentra exactamente lo que necesitas con precios competitivos.
                    </p>
                    <div className="mt-6 flex items-center justify-center space-x-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Envío Gratis</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Garantía de Calidad</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Soporte 24/7</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                            isAuthenticated={isAuthenticated}
                            loginWithRedirect={loginWithRedirect}
                            API_BASE_URL={API_BASE_URL}
                        />
                    ))}
                </div>

                {products.length === 0 && !isLoading && (
                    <div className="text-center py-16">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No hay productos disponibles</h3>
                        <p className="text-gray-600 mb-6">Por el momento no tenemos productos en nuestro catálogo.</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Recargar Página
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductListPage;