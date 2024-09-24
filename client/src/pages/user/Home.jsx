import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // For loading state
    const [error, setError] = useState(""); // For error handling

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/v1/products/allproducts'); // Adjust API endpoint as needed
                setProducts(response.data.data); 
            } catch (err) {
                setError("Failed to fetch products. Please try again later.");
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return <p className="text-gray-600">Loading...</p>; // Loading state
    }

    return (
        <div className='flex flex-col items-center mt-4'>
            <h2 className="text-2xl font-bold mb-6">All Products</h2>
            {error && <p className="text-red-500">{error}</p>} {/* Error message */}
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.length ? (
                    products.map(product => (
                        <li key={product._id} className="mb-4 p-4 w-80 border rounded shadow">
                            <img
                                src={product.images[0]} // Display the first image
                                alt={product.name}
                                className="mb-2 w-full h-auto rounded"
                            />
                            <h3 className="font-bold text-lg">{product.name}</h3>
                            <p className="text-gray-700">{product.description}</p>
                            <span className="text-gray-600">${product.price.toFixed(2)}</span> {/* Format price */}
                        </li>
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </ul>
        </div>
    );
};

export default Home;
