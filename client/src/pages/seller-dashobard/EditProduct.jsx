import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProduct = () => {
  const  id  = useParams();
  const navigate = useNavigate();
  console.log("id from params", id.productId)

  const [error, setError] = useState('')

  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: ''
  });
// let id2 = '66eebf8f281ca6a798012b3f'
  // Fetch product details on component mount
  useEffect(() => {
    axios.get(`/api/v1/products/product/${id.productId}`)
      .then((response) => {
          if (response.data) {
            const productData = response.data.data
            setProduct(
                {name: productData.name,
                price: productData.price,
                description: productData.description,
                category: productData.category}
            )
        //   console.log("response.data.data in Edit Product", response.data.data);
        //   console.log("product in Edit Product", product);
        } else {
          console.error("No product data found");
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the product!", error);
      });
      console.log(product)
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  // Handle save button click
  const handleSave = async (e) => {
      e.preventDefault();
    console.log("On clicking save button the product data is", product)
    console.log("On clicking save button the product id is", id.productId)
    try {
        const response = await axios.put(`/api/v1/products/product/update/${id.productId}`, product);
        // setProduct(response.data.data);
        if(response){
            navigate('/seller/dashboard/view-products')
        }
    } catch (error) {
        setError("Failed to update user data");
    }
    // await axios.put(`/api/v1/products/product/update/${id.productId}`, product)
    //   .then((response) => {
    //     alert('Product updated successfully!');
    //     navigate('/seller/dashboard/view-products'); // Redirect to products page
    //   })
    //   .catch((error) => {
    //     console.error("There was an error updating the product!", error);
    //   });
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate('/seller/dashboard/view-products'); // Redirect back to products page
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5 text-center">Edit Product</h2>
      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700">Price:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700">Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700">Category:</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className="flex justify-between">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Save</button>
          <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-400 text-white rounded-lg">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
