import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import apiClient from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

        await toast.promise(
            apiClient.post('/carts/items', { productId, quantity: 1 }),
            {
                pending: 'Adding to cart...',
                success: 'Item added to cart!',
                error: 'Could not add item. Service may be down.'
            }
        );
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group">
                        <div className="relative">
                            <img src={API_BASE_URL + product.imageUrl} alt={product.name} className="h-56 w-full object-cover" />
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                            <p className="text-gray-600 mt-2 text-xl font-bold">${product.price.toFixed(2)}</p>
                            <button
                                onClick={() => handleAddToCart(product.id)}
                                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductListPage;