import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditProduct from './EditProduct';

const ViewProducts = () => {

    const navigate = useNavigate()

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // For loading state
    const [error, setError] = useState(""); // For error handling

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/v1/products/products');
                setProducts(response.data.data);
            } catch (err) {
                setError("Failed to fetch products. Please try again later.");
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };
        fetchProducts();
    }, []);

    const handleEdit = (productId) => {
navigate(`/seller/dashboard/product/${productId}`, <EditProduct />)
    }

    const handleDelete = async(productId) => {
        console.log("productId", productId)
        try {
           const response = await axios.delete(`/api/v1/products/product/delete/${productId}`)
            .then( async(response) => {
                alert("product deleted Successfully")
                console.log(response)
                const response2 = await axios.get('/api/v1/products/products');
                setProducts(response2.data.data);
            })
        } catch (error) {
            console.log("Error while deleting the product", error)
        }
    }

    if (loading) {
        return <p className="text-gray-600">Loading...</p>; // Loading state
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Your Products</h2>
            {error && <p className="text-red-500">{error}</p>} {/* Error message */}
            <ul>
                {products.length ? (
                    products.map(product => (
                        <li key={product._id} className="mb-4 p-4 border rounded shadow">
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="mb-2 w-44 h-auto rounded"
                            />
                            <h3 className="font-bold text-lg">{product.name}</h3>
                            <p className="text-gray-700">{product.description}</p>
                            <span className="text-gray-600">${product.price.toFixed(2)}</span> {/* Format price */}
                            <div className='flex gap-2 text-blue-800'>
                                <button onClick={() => handleEdit(product._id)} className="edit">Edit</button>
                                <button onClick={() => handleDelete(product._id)} className="delete">Delete</button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </ul>
        </div>
    );
};

export default ViewProducts;
