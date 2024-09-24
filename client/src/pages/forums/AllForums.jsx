import React, { useState, useEffect } from "react";
import { FaCommentAlt, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import AddForums from "./AddForums.jsx";
import AddComment from "./AddComment.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllForums = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user); // Get user from Redux state
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/v1/forums/all");
      const data = await response.json();
      setPosts(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (postId) => {
    navigate(`/all-forums/forum/edit/${postId}`);
  };

  const handlePostLike = async (postId) => {
    await axios.post(`/api/v1/commentlike/${postId}/like`)
      .then((response) => {
        console.log("Like Added");
        fetchPosts(); // Refresh posts to update the like state
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handlePostDislike = async (postId) => {
    await axios.post(`/api/v1/commentlike/${postId}/dislike`)
      .then((response) => {
        if(response.data.success){
          console.log('hi')
        }
          console.log("repsonse.data.success", response.data.success)
        console.log("Dislike Added");
        console.log(response)
        fetchPosts(); // Refresh posts to update the like state
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/api/v1/forums/delete/${postId}`)
        .then(async (response) => {
          alert("Post deleted successfully");
          fetchPosts();
        });
    } catch (error) {
      console.log("Error while deleting the post", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AddForums />
      {posts.length > 0 ? (
        posts.map((post) => {
          // Check if the user has liked the post
          const userLiked = post.likes.includes(user._id);
          const userDisliked = post.dislikes.includes(user._id);

          return (
            <div
              key={post._id}
              className="forum-post bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{post.content}</h3>
                  <p className="text-gray-600 text-sm">
                    Posted by: <span className="font-medium">{post.uploadByUserId.fullName}</span>
                  </p>
                  <p className="text-gray-500 text-xs mb-4">
                    Posted on: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="btns flex gap-4">
                  <button onClick={() => handleEdit(post._id)} className="text-blue-700">Edit</button>
                  <button onClick={() => handleDelete(post._id)} className="text-blue-700">Delete</button>
                </div>
              </div>

              {post.images.length > 0 && (
                <div className="post-images grid grid-cols-3 gap-4 mb-4">
                  {post.images.map((image, idx) => (
                    <img
                      key={idx}
                      src={image}
                      className="w-full h-24 object-cover rounded-md shadow-sm"
                      alt={`Post image ${idx}`}
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 text-gray-600 text-sm">
                <div className="flex items-center">
                  <FaCommentAlt className="mr-2 text-blue-500" />
                  <p>{post.comments.length} comments</p>
                </div>

                <div
                  onClick={() => handlePostLike(post._id)}
                  className="flex items-center cursor-pointer"
                >
                  <FaThumbsUp
                    className={`mr-2 ${userLiked ? 'text-blue-500' : 'text-gray-300'}`} // Change color if liked
                  />
                  <p>{post.likes.length} likes</p>
                </div>

                <div onClick={() => handlePostDislike(post._id)} className="flex items-center">
                  <FaThumbsDown className={`mr-2 ${userDisliked ? 'text-blue-500' : 'text-gray-300'}`} />
                  <p>{post.dislikes.length} dislikes</p>
                </div>
              </div>

              {user && <AddComment postId={post._id} />}
            </div>
          );
        })
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default AllForums;
