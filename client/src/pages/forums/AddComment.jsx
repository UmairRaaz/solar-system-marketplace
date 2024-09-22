import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const AddComment = ({ postId }) => {
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/v1/forums/${postId}/comments`, { content: comment });
      if (response.data.success) {
        setComment(''); // Clear the comment input
        // Optionally, you can dispatch an action to update comments in the Redux store or refetch posts
      }
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  return (
    <form onSubmit={handleCommentSubmit} className="add-comment-form">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        required
        className="w-full border rounded-md p-2"
      />
      <button type="submit" className="mt-2 bg-blue-600 text-white p-2 rounded-md">
        Submit Comment
      </button>
    </form>
  );
};

export default AddComment;
