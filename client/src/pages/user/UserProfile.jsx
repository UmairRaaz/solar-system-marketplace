import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

const UserProfile = () => {
  const [user, setUser] = useState({
    fullName: "",
    role: "",
    userName: "",
    profileImage: "",
    phoneNumber: "",
    addressRef: {
      street: "",
      area: "",
      city: "",
      province: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // New state for image preview

  useEffect(() => {
    axios
      .get("/api/v1/users/user")
      .then((response) => {
        const userData = response.data.data;
        setUser({
          ...userData,
          addressRef: userData.addressRef || {
            street: "",
            area: "",
            city: "",
            province: "",
          },
        });
        setEditedUser({
          ...userData,
          addressRef: userData.addressRef || {
            street: "",
            area: "",
            city: "",
            province: "",
          },
        });
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch user data");
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      addressRef: { ...prev.addressRef, [name]: value },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    if (file) {
      const url = URL.createObjectURL(file); // Create object URL for preview
      setPreviewImage(url); // Set preview image URL
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    
    // Append edited user data
    Object.keys(editedUser).forEach((key) => {
        if (key === "addressRef") {
            Object.keys(editedUser.addressRef).forEach((addressKey) => {
                formData.append(`addressRef[${addressKey}]`, editedUser.addressRef[addressKey]);
            });
        } else {
            formData.append(key, editedUser[key]); // Ensure 'fullName' is included here
        }
    });

    // If a new image was selected, append it
    if (selectedImage) {
        formData.append("image", selectedImage);
    }

    try {
        const response = await axios.put("/api/v1/users/user/edituser", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        setUser(response.data.data);
        setIsEditing(false);
        setPreviewImage(null); // Reset preview image after saving
    } catch (error) {
        setError("Failed to update user data");
    }
};

  

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // if (error) {
  //   return <div className="text-center text-red-500 py-10">{error}</div>;
  // }

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">User Profile</h1>

      {/* Profile Image */}
      <div className="flex items-center justify-center mb-6 relative">
        <img
          src={previewImage || user.image || "https://via.placeholder.com/150"}
          alt="User Avatar"
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
        />
        {isEditing && (
          <label className="absolute bottom-0 right-0 bg-gray-300 p-1 rounded-full cursor-pointer">
            <FaEdit className="text-black" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        )}
      </div>

      {!isEditing ? (
        <>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium">
              Full Name
            </label>
            <p className="text-lg text-gray-900">{user.fullName}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium">
              Email
            </label>
            <p className="text-lg text-gray-900">{user.email}</p>
          </div>
          {user.phoneNumber && (
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-medium">
                Phone Number
              </label>
              <p className="text-lg text-gray-900">{user.phoneNumber}</p>
            </div>
          )}
          {user.addressRef && (
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-medium">
                Address
              </label>
              <p className="text-lg text-gray-900">{`${user.addressRef.street} ${user.addressRef.area} ${user.addressRef.city} ${user.addressRef.province}`}</p>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium">
              Username
            </label>
            <p className="text-lg text-gray-900">{user.userName}</p>
          </div>

          {/* Edit Button */}
          <button
            className="flex items-center text-blue-500 hover:text-blue-700"
            onClick={() => setIsEditing(true)}
          >
            <FaEdit className="mr-2" /> Edit Profile
          </button>
        </>
      ) : (
        <>
          {/* Edit Form */}
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={editedUser.fullName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={editedUser.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium">
              Address
            </label>
            <input
              type="text"
              name="street"
              placeholder="Street"
              value={editedUser.addressRef.street}
              onChange={handleAddressChange}
              className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="area"
              placeholder="Area"
              value={editedUser.addressRef.area}
              onChange={handleAddressChange}
              className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={editedUser.addressRef.city}
              onChange={handleAddressChange}
              className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="province"
              placeholder="Province"
              value={editedUser.addressRef.province}
              onChange={handleAddressChange}
              className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Save and Cancel Buttons */}
          <div className="flex space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
