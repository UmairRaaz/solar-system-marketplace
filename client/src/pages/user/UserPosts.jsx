import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useSelector((state) => state.auth); 

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`/api/v1/forums/my-posts`);
        console.log(response)
        setPosts(response.data.data); 
      } catch (error) {
        console.error('Failed to fetch posts', error);
      }
    };

    fetchUserPosts();
  }, [user._id, user.token]);

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/api/v1/forums/delete/${postId}`);
        setPosts(posts.filter(post => post._id !== postId));
      } catch (error) {
        console.error('Failed to delete post', error);
      }
    }
  };

  return (
    <div className="user-posts-container bg-gray-100 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
      {posts.length === 0 ? (
        <p>You have no posts.</p>
      ) : (
        posts.map(post => (
          <div key={post._id} className="forum-post bg-white shadow-md rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">{post.content}</h3>
            {post?.images?.length > 0 && (
              <div className="post-images grid grid-cols-3 gap-2 mb-2">
                {post?.images.map((image, idx) => (
                  <img key={idx} src={image} className="w-full h-24 object-cover rounded-md" alt={`Post image ${idx}`} />
                ))}
              </div>
            )}
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                <p>Posted on: {new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-4">
                {/* <button
                  className="text-blue-500 hover:text-blue-700 flex items-center"
                  onClick={() => window.location.href = `/edit-post/${post._id}`} // Assuming there's an edit route
                >
                  <FaEdit className="mr-1" /> Edit
                </button> */}
                <button
                  className="text-red-500 hover:text-red-700 flex items-center"
                  onClick={() => handleDelete(post._id)}
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserPosts;
