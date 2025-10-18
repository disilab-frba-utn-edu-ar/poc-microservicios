import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../services/api';
import { toast } from 'react-toastify';

const AdminPage = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const validateAndSetFile = (selectedFile) => {
        if (!selectedFile) {
            setFile(null);
            setPreviewUrl(null);
            return false;
        }

        if (!selectedFile.type.startsWith('image/')) {
            toast.error('Tipo de archivo inválido. Por favor selecciona una imagen.');
            return false;
        }

        if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error('El archivo es demasiado grande. Máximo 5MB.');
            return false;
        }

        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        return true;
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        validateAndSetFile(selectedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('Please select an image file.');
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Invalid file type. Please select an image.');
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('file', file, file.name);
        const productData = { name, price: parseFloat(price) };
        const productBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });
        formData.append('product', productBlob);

        const creationPromise = apiClient.post('/products', formData);

        toast.promise(
            creationPromise,
            {
                pending: 'Creando producto...',
                success: '¡Producto creado exitosamente!',
                error: 'Error al crear el producto. Verifica los logs o permisos.'
            }
        );

        try {
            await creationPromise;
            setName('');
            setPrice('');
            setFile(null);
            setPreviewUrl(null);
            e.target.reset();
        } catch (error) {
            console.error("Product creation failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Crear Nuevo Producto</h1>
                    <p className="text-lg text-gray-600">Completa la información para agregar un nuevo producto al catálogo</p>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Product Information Section */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Información del Producto</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Product Name */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Nombre del Producto *
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            id="name" 
                                            value={name} 
                                            onChange={e => setName(e.target.value)} 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed" 
                                            placeholder="Ej: iPhone 15 Pro"
                                            required 
                                            disabled={isSubmitting} 
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                        Precio *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 text-sm font-medium">$</span>
                                        </div>
                                        <input 
                                            type="number" 
                                            id="price" 
                                            value={price} 
                                            onChange={e => setPrice(e.target.value)} 
                                            step="0.01" 
                                            min="0" 
                                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed" 
                                            placeholder="0.00"
                                            required 
                                            disabled={isSubmitting} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image Upload Section */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Imagen del Producto</h2>
                            </div>

                            {/* Drag & Drop Area */}
                            <div
                                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                                    isDragOver 
                                        ? 'border-blue-400 bg-blue-50 scale-105' 
                                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                } ${file ? 'border-green-400 bg-green-50' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    id="file"
                                    onChange={handleFileChange}
                                    accept="image/jpeg, image/png, image/webp, image/gif"
                                    className="hidden"
                                    required
                                    disabled={isSubmitting}
                                />

                                {!file ? (
                                    <div className="space-y-4">
                                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium text-gray-900 mb-2">
                                                Arrastra tu imagen aquí o{' '}
                                                <button
                                                    type="button"
                                                    onClick={handleUploadClick}
                                                    className="text-blue-600 hover:text-blue-700 font-semibold underline"
                                                    disabled={isSubmitting}
                                                >
                                                    haz clic para seleccionar
                                                </button>
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                PNG, JPG, WEBP o GIF hasta 5MB
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium text-green-900 mb-2">
                                                ¡Imagen seleccionada!
                                            </p>
                                            <p className="text-sm text-gray-500 mb-4">
                                                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                            </p>
                                            <button
                                                type="button"
                                                onClick={handleUploadClick}
                                                className="text-blue-600 hover:text-blue-700 font-semibold underline"
                                                disabled={isSubmitting}
                                            >
                                                Cambiar imagen
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Image Preview */}
                            {previewUrl && (
                                <div className="flex justify-center">
                                    <div className="relative group">
                                        <img 
                                            src={previewUrl} 
                                            alt="Vista previa" 
                                            className="max-h-64 w-auto rounded-xl shadow-lg border border-gray-200 transition-transform duration-200 group-hover:scale-105" 
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-200 flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFile(null);
                                                    setPreviewUrl(null);
                                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                                }}
                                                className="opacity-0 group-hover:opacity-100 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-600"
                                                disabled={isSubmitting}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting || !file || !name || !price}
                                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:scale-100"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creando Producto...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Crear Producto
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;