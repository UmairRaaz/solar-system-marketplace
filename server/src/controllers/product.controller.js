import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/product.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs"

const addProduct = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== "seller") {
        throw new ApiError(403, "Access denied. Only sellers can add products.");
    }

    const { name, price, description, category } = req.body;

    // Validate input fields
    if (!name || !price || !description || !category) {
        throw new ApiError(400, "All fields are required.");
    }

    let imageUrl = "";

    if (req.file) {
        try {
            const imageOnCloudinary = await uploadOnCloudinary(req.file.path);
            imageUrl = imageOnCloudinary.secure_url;
        } catch (error) {
            throw new ApiError(500, 'Error uploading image to Cloudinary');
        }
    } else {
        throw new ApiError(400, "Image is required.");
    }

    const newProduct = await Product.create({
        name,
        price,
        description,
        images: imageUrl,
        category,
        uploadBy: user._id,
    });

    return res.status(201)
        .json(new ApiResponse(201, newProduct, "Product added successfully"));
});



// Update an existing product
const updateProduct = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== "seller") {
        throw new ApiError(403, "Access denied. Only sellers can update products.");
    }
    // console.log("user on updateProduct route", user)

    const productId = req.params.id;
    const product = await Product.findById(productId);

    // console.log("productId on  updateProduct route", productId)
    // console.log("product on  updateProduct route", product)

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Check if the product belongs to the seller
    if (product.uploadBy.toString() !== user._id.toString()) {
        throw new ApiError(403, "Access denied. You can only update your own products.");
    }

    // Update product fields
    const { name, price, description, category } = req.body;
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;

    // console.log("req.body", name, price, description, category)

    await product.save();
    // console.log("After update the product is", product)

    return res.status(200)
        .json(new ApiResponse(200, product, "Product updated successfully"));
});

// Get all products (for the seller)
const getAllProducts = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== "seller") {
        throw new ApiError(403, "Access denied. Only sellers can view products.");
    }

    const products = await Product.find({ uploadBy: user._id });

    return res.status(200)
        .json(new ApiResponse(200, products, "Products fetched successfully"));
});
const getProducts = asyncHandler(async (req, res) => {
    const user = req.user;
    const products = await Product.find({ });

    return res.status(200)
        .json(new ApiResponse(200, products, "Products fetched successfully"));
});

// Get a single product by ID
const getProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    console.log("productId", productId)
    const product = await Product.findById(productId);
console.log("product", product)
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200)
        .json(new ApiResponse(200, product, "Product fetched successfully"));
});


// huns ---------
const deleteProduct = asyncHandler(async (req, res) => {
    const productId  = req.params.id;
    console.log("productId on deleteProduct", productId)

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    // Check if the logged-in user is the owner of the product
    if (product.uploadBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this product.");
    }
    const deletedProduct = await Product.findByIdAndDelete(productId)
    return res.status(200).json(new ApiResponse(200, null, "Product deleted successfully."));
});

export { addProduct, updateProduct, getAllProducts, getProduct, getProducts, deleteProduct };
