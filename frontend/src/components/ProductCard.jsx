import React, { useState } from 'react';

const ProductCard = ({ product, onAddToCart, isAuthenticated, loginWithRedirect, API_BASE_URL }) => {
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            loginWithRedirect({ appState: { returnTo: window.location.pathname } });
            return;
        }

        setIsAddingToCart(true);
        try {
            await onAddToCart(product.id);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(true);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2">
            <div className="relative h-64 overflow-hidden bg-gray-100">
                {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                )}
                
                {imageError ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <div className="text-center text-gray-500">
                            <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm">Imagen no disponible</p>
                        </div>
                    </div>
                ) : (
                    <img 
                        src={API_BASE_URL + product.imageUrl} 
                        alt={product.name}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    />
                )}
                
               

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                    <span className="text-lg font-bold text-green-600">
                        ${product.price.toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                    </h3>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Disponible</span>
                    </div>
                    
                    <button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            isAddingToCart
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-105'
                        }`}
                    >
                        {isAddingToCart ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                                <span>Agregando...</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Agregar</span>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
