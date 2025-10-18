import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCart } from '../contexts/CartContext';
import CartItemCard from '../components/CartItemCard';

const CartPage = () => {
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { cart, isLoading, updateCartItem, removeFromCart, checkout } = useCart();
    const navigate = useNavigate();

    const handleUpdateQuantity = async (productId, amount) => {
        try {
            await toast.promise(
                updateCartItem(productId, amount),
                { 
                    pending: 'Actualizando cantidad...', 
                    success: '¡Cantidad actualizada!', 
                    error: 'Error al actualizar la cantidad.' 
                }
            );
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const handleDeleteItem = async (productId) => {
        try {
            await toast.promise(
                removeFromCart(productId),
                { 
                    pending: 'Eliminando producto...', 
                    success: '¡Producto eliminado!', 
                    error: 'Error al eliminar el producto.' 
                }
            );
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            await toast.promise(
                checkout(),
                {
                    pending: 'Procesando tu pedido...',
                    success: '¡Pedido realizado exitosamente!',
                    error: 'Error al procesar el pedido. Inténtalo de nuevo.'
                }
            );
            
            // Redirect to success page after successful checkout
            navigate('/order-success');
        } catch (error) {
            console.error("Checkout failed:", error);
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const totalItemCount = cart?.items ? cart.items.reduce((count, item) => count + item.amount, 0) : 0; // Use 'amount'
    const totalCartPrice = cart?.items ? cart.items.reduce((sum, item) => sum + (item.priceAtTimeOfAdd * item.amount), 0) : 0; // Use 'amount'

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Mi Carrito de Compras
                    </h1>
                    
                    {cart && cart.items.length > 0 && (
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Revisa tus productos seleccionados y completa tu compra de manera segura
                    </p>
                    )}
                </div>

                {cart && cart.items.length > 0 ? (
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Productos ({totalItemCount} {totalItemCount === 1 ? 'artículo' : 'artículos'})
                                    </h2>
                                    <Link 
                                        to="/" 
                                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        <span>Seguir Comprando</span>
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {cart.items.map((item, index) => (
                                        <div 
                                            key={item.productId}
                                            className="animate-fade-in"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <CartItemCard
                                                item={item}
                                                onUpdate={handleUpdateQuantity}
                                                onDelete={handleDeleteItem}
                                                apiBaseUrl={API_BASE_URL}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Checkout Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h3>
                                    
                                    {/* Order Summary */}
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Subtotal ({totalItemCount} artículos)</span>
                                            <span className="font-semibold">${totalCartPrice.toFixed(2)}</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Envío</span>
                                            <span className="font-semibold text-green-600">Gratis</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Impuestos</span>
                                            <span className="font-semibold">$0.00</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-4">
                                            <span className="text-lg font-bold text-gray-900">Total</span>
                                            <span className="text-2xl font-bold text-blue-600">${totalCartPrice.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <button
                                        onClick={handleCheckout}
                                        disabled={isCheckingOut}
                                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 transform ${
                                            isCheckingOut
                                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-xl hover:scale-105'
                                        }`}
                                    >
                                        {isCheckingOut ? (
                                            <div className="flex items-center justify-center space-x-3">
                                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Procesando...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center space-x-3">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                                                </svg>
                                                <span>Finalizar Compra</span>
                                            </div>
                                        )}
                                    </button>

                                    {/* Security Badge */}
                                    <div className="mt-6 text-center">
                                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            <span>Compra 100% Segura</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty Cart State */
                    <div className="max-w-2xl mx-auto text-center py-16">
                        <div className="mx-auto w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-8">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h3>
                        <p className="text-lg text-gray-600 mb-8">
                            Parece que aún no has agregado ningún producto a tu carrito. 
                            ¡Explora nuestra selección y encuentra algo que te guste!
                        </p>
                        <Link 
                            to="/" 
                            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span>Empezar a Comprar</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;