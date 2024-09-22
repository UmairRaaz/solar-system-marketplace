import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const AddForums = () => {
  const { register, handleSubmit, watch , reset} = useForm();
  const images = watch("images"); // Use watch to monitor file inputs

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("content", data.content);

    // Append images if any
    if (data.images) {
      Array.from(data.images).forEach((image) => {
        formData.append("images", image);
      });
    }

    try {
      const response = await axios.post("/api/v1/forums/add", formData);
      console.log(response);
      if (response.data.success) {
        // Reset the form if successful
        reset();
      }
    } catch (error) {
      console.error("Error adding forum:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 bg-gray-100 px-5 mb-10">
      <form id="add-forum-form" onSubmit={handleSubmit(onSubmit)} className="add-forum-form">
        <textarea
          {...register("content", { required: true })}
          placeholder="Add forum content..."
          className="w-full border rounded-md p-2"
        />
        <input
          type="file"
          multiple
          {...register("images")}
          className="mt-2"
        />
        {images && images.length > 0 && (
          <div className="image-preview">
            {Array.from(images).map((image, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(image)} // Show preview using the file object
                alt={`Preview ${idx}`}
                className="w-20 h-20 object-cover m-2"
              />
            ))}
          </div>
        )}
        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white p-2 rounded-md"
        >
          Add Forum
        </button>
      </form>
    </div>
  );
};

export default AddForums;
