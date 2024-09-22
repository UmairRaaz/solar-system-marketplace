import React, { useState, useEffect } from "react";
import { FaCommentAlt, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import AddForums from "./AddForums.jsx";
import AddComment from "./AddComment.jsx";

const AllForums = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user); // Get user from Redux state

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/v1/forums/all");

        const data = await response.json();
        console.log(data);
        setPosts(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AddForums />
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            className="forum-post bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200"
          >
            <h3 className="text-xl font-semibold mb-2">{post.content}</h3>
            <p className="text-gray-600 text-sm">
              Posted by:{" "}
              <span className="font-medium">
                {post.uploadByUserId.fullName}
              </span>
            </p>
            <p className="text-gray-500 text-xs mb-4">
              Posted on: {new Date(post.createdAt).toLocaleDateString()}
            </p>

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

              <div className="flex items-center">
                <FaThumbsUp className="mr-2 text-green-500" />
                <p>{post.likes.length} likes</p>
              </div>

              <div className="flex items-center">
                <FaThumbsDown className="mr-2 text-red-500" />
                <p>{post.dislikes.length} dislikes</p>
              </div>
            </div>

            {user && <AddComment postId={post._id} />}
          </div>
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default AllForums;
