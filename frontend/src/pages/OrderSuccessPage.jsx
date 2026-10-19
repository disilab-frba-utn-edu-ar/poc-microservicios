import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import apiClient from '../services/api';

const OrderSuccessPage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');
    const { clearLocalCart } = useCart();
    
    const [orderData, setOrderData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPolling, setIsPolling] = useState(false);
    const [pollCount, setPollCount] = useState(0);

    useEffect(() => {
        let timeoutId;
        
        const fetchOrder = async () => {
            if (!sessionId) return;
            
            try {
                const response = await apiClient.get(`/orders/session/${sessionId}`);
                const data = response.data;
                
                setOrderData(data);
                
                // If it's still pending and we haven't polled 10 times (20 seconds), keep polling
                if (data.status === 'PENDING' && pollCount < 10) {
                    setIsPolling(true);
                    timeoutId = setTimeout(() => {
                        setPollCount(prev => prev + 1);
                    }, 2000);
                } else {
                    // Terminal state or max polls reached
                    setIsPolling(false);
                    setIsLoading(false);
                    if (data.status === 'PAID') {
                        clearLocalCart();
                    }
                }
            } catch (error) {
                console.error("Failed to fetch order:", error);
                setIsLoading(false);
                setIsPolling(false);
            }
        };

        fetchOrder();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [sessionId, pollCount, clearLocalCart]);

    if (isLoading && !orderData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirmando tu pago...</h2>
                    <p className="text-gray-600">Por favor, espera un momento mientras validamos la transacción con Stripe.</p>
                </div>
            </div>
        );
    }

    if (!orderData && !sessionId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Error al cargar el pedido
                    </h1>
                    <p className="text-xl text-gray-600 mb-6">
                        No se pudieron cargar los detalles del pedido. Por favor, intenta nuevamente.
                    </p>
                    <Link 
                        to="/" 
                        className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>Volver al Inicio</span>
                    </Link>
                </div>
            </div>
        );
    }

    if (!orderData && sessionId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 success-icon">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        ¡Pago Procesado Exitosamente!
                    </h1>
                    <p className="text-xl text-gray-600 mb-6">
                        Gracias por tu compra. Tu pago a través de Stripe ha sido confirmado y tu pedido está siendo procesado.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p className="text-green-800 font-medium">
                            Recibirás un correo electrónico con los detalles completos del pedido en breve.
                        </p>
                    </div>
                    <Link 
                        to="/" 
                        className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        <span>Seguir Comprando</span>
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            timeZone: 'UTC',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const totalItems = orderData.orderItems.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 success-icon">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <div className="text-center mb-8 slide-up">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {orderData.status === 'PENDING' ? '¡Tu pago está en proceso!' : '¡Compra Realizada Exitosamente!'}
                    </h1>
                    <p className="text-xl text-gray-600 mb-6">
                        Gracias por tu compra, {orderData.userDetails.firstName}. 
                        {orderData.status === 'PENDING' 
                            ? ' Tu pedido se está procesando de manera segura. Te enviaremos un correo en cuanto se confirme el pago.' 
                            : ' Tu pedido ha sido procesado y recibirás una confirmación por correo electrónico.'}
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p className="text-green-800 font-medium">
                            📧 Te hemos enviado un correo a {orderData.userDetails.userEmail} con los detalles de tu pedido.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles del Pedido</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Número de Pedido</span>
                                <span className="font-semibold text-gray-900">#{orderData.id}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Fecha de Compra</span>
                                <span className="font-semibold text-gray-900">
                                    {formatDate(orderData.date)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Estado</span>
                                <span className="font-semibold text-green-600">{orderData.description}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Total de Artículos</span>
                                <span className="font-semibold text-gray-900">{totalItems}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-4">
                                <span className="text-lg font-bold text-gray-900">Total Pagado</span>
                                <span className="text-2xl font-bold text-blue-600">${orderData.finalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del Cliente</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Nombre Completo</span>
                                <span className="font-semibold text-gray-900">{orderData.userDetails.fullName}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Email</span>
                                <span className="font-semibold text-gray-900">{orderData.userDetails.userEmail}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Tiempo de Entrega Estimado</span>
                                <span className="font-semibold text-gray-900">3-5 días hábiles</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Productos Comprados</h2>
                    <div className="space-y-4">
                        {orderData.orderItems.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                        {item.imageUrl ? (
                                            <img 
                                                src={`${import.meta.env.VITE_S3_BASE_URL}${item.imageUrl}`}
                                                alt={item.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                                    <p className="text-sm text-gray-600">ID del Producto: {item.productId}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">Cantidad: {item.amount}</p>
                                    <p className="text-lg font-bold text-blue-600">${item.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Link 
                        to="/" 
                        className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span>Seguir Comprando</span>
                    </Link>
                    
                    <Link 
                        to="/cart" 
                        className="inline-flex items-center justify-center space-x-3 bg-white text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Ver Carrito</span>
                    </Link>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 mb-4">
                        ¿Tienes alguna pregunta sobre tu pedido?
                    </p>
                    <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>Instagram: @ddsutnbaoficial</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
