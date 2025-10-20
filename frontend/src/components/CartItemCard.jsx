import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartItemCard = ({ item, onUpdate, onDelete, apiBaseUrl }) => {
    const [currentQuantity, setCurrentQuantity] = useState(item.amount);
    const [isSaving, setIsSaving] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        setCurrentQuantity(value >= 1 ? value : 1);
    };

    const handleSaveClick = async () => {
        if (currentQuantity === item.amount) return;
        setIsSaving(true);
        await onUpdate(item.productId, currentQuantity);
        setIsSaving(false);
    };

    const handleDeleteClick = async () => {
        setIsSaving(true);
        await onDelete(item.productId);
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(true);
    };

    useEffect(() => {
        setCurrentQuantity(item.amount);
    }, [item.amount]);

    const subtotal = item.priceAtTimeOfAdd * currentQuantity;

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
            <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-shrink-0">
                        <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-xl overflow-hidden bg-gray-100">
                            {!imageLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                                </div>
                            )}
                            
                            {imageError ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                    <div className="text-center text-gray-500">
                                        <svg className="w-12 h-12 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-xs">Sin imagen</p>
                                    </div>
                                </div>
                            ) : (
                                <img 
                                    src={`${apiBaseUrl}${item.imageUrl}`} 
                                    alt={item.productName}
                                    className={`w-full h-full object-cover transition-all duration-300 ${
                                        imageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex-grow min-w-0">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {item.productName}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="font-medium">Precio unitario: ${item.priceAtTimeOfAdd.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <label className="text-sm font-medium text-gray-700">Cantidad:</label>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setCurrentQuantity(Math.max(1, currentQuantity - 1))}
                                        disabled={isSaving || currentQuantity <= 1}
                                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                    >
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    
                                    <input
                                        type="number"
                                        value={currentQuantity}
                                        onChange={handleQuantityChange}
                                        className="w-16 text-center border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        min="1"
                                        disabled={isSaving}
                                    />
                                    
                                    <button
                                        onClick={() => setCurrentQuantity(currentQuantity + 1)}
                                        disabled={isSaving}
                                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                    >
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-gray-600">Subtotal</p>
                                <p className="text-xl font-bold text-gray-900">
                                    ${subtotal.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-3">
                                {currentQuantity !== item.amount && (
                                    <button
                                        onClick={handleSaveClick}
                                        disabled={isSaving}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                            isSaving 
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg transform hover:scale-105'
                                        }`}
                                    >
                                        {isSaving ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                                                <span>Guardando...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Guardar Cambios</span>
                                            </div>
                                        )}
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={handleDeleteClick}
                                disabled={isSaving}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    isSaving 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                        : 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg transform hover:scale-105'
                                }`}
                            >
                                {isSaving ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Eliminando...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span>Eliminar</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItemCard;
