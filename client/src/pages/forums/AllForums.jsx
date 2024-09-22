import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; 
import AddForums from './AddForums.jsx'; 
import AddComment from './AddComment.jsx';

const AllForums = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user); // Get user from Redux state

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/v1/forums/all'); 
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <AddForums /> {/* Add the AddForums component here */}
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="forum-post">
            <h3>{post.content}</h3>
            <p>Posted by: {post.uploadByUserId.name}</p>
            <p>Posted on: {new Date(post.createdAt).toLocaleDateString()}</p>
            {post.images.length > 0 && (
              <div className="post-images">
                {post.images.map((image, idx) => (
                  <img key={idx} src={image} alt={`Post image ${idx}`} />
                ))}
              </div>
            )}
            <div>
              <p>{post.comments.length} comments</p>
              <p>{post.likes.length} likes</p>
              <p>{post.dislikes.length} dislikes</p>
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
