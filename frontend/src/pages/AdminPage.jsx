import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { toast } from 'react-toastify';

const AdminPage = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (!selectedFile.type.startsWith('image/')) {
                toast.error('Invalid file type. Please select an image.');
                setFile(null);
                setPreviewUrl(null);
                e.target.value = null;
                return;
            }
            setFile(selectedFile);
            // Create a preview URL
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreviewUrl(null);
        }
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
                pending: 'Creating product...',
                success: 'Product created successfully!',
                error: 'Failed to create product. Check logs or permissions.'
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
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Create New Product</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required disabled={isSubmitting} />
                </div>

                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} step="0.01" min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required disabled={isSubmitting} />
                </div>

                <div>
                    <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                        Product Image
                    </label>
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        accept="image/jpeg, image/png, image/webp, image/gif"
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                        required
                        disabled={isSubmitting}
                    />
                    {previewUrl && (
                        <div className="mt-4 border p-2 rounded-md inline-block">
                            <img src={previewUrl} alt="Image Preview" className="h-32 w-auto object-contain rounded" />
                        </div>
                    )}
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isSubmitting || !file || !name || !price}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminPage;