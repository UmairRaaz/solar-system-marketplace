import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditForum = () => {
  const { postId } = useParams(); // Get postId from URL params
  const navigate = useNavigate(); // For redirecting after updating the post
  const [post, setPost] = useState({ content: '', images: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);

  // Fetch post data on component mount
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/v1/forums/get-post/${postId}`);
        setPost(response.data.data); // Assuming the post data is in response.data.data
        setContent(response.data.data.content);
        setImages(response.data.data.images);
        setLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...imageUrls]); // Add new image URLs to the existing images
    console.log(imageUrls)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/v1/forums/edit/${postId}`, { content, images });
      navigate('/all-forums'); // Redirect to the post page after successful edit
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const handleDeletePreviousImages = (e) => {
    e.preventDefault()
    setImages([])
  }

  if (loading) {
    return <p>Loading post data...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Content Input */}
        <div>
          <label htmlFor="content" className="block text-lg font-semibold">
            Content
          </label>
          <textarea
            id="content"
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            rows="6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="images" className="block text-lg font-semibold">
            Images
          </label>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
            onChange={handleImageChange}
          />
          <button onClick={(e) => handleDeletePreviousImages(e)} className='text-blue-700'>Remove Image</button>
          {/* Display selected images */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {images.map((img, index) => (
              <img key={index} src={img} alt={`Post Image ${index}`} className="w-full h-auto rounded-md" />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors"
        >
          Update Post
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default EditForum;
