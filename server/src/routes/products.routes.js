import { Router } from "express";
import { addProduct, updateProduct, getAllProducts, getProduct, getProducts, deleteProduct } from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/userauth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/product/add").post(verifyJWT, upload.single('images'), addProduct);
// router.route("/product/update/:id").put(verifyJWT, upload.single('images'), updateProduct);
router.route("/product/update/:id").put(verifyJWT, updateProduct);
router.route("/products").get(verifyJWT, getAllProducts);
router.route("/product/:id").get(verifyJWT, getProduct);
router.route("/allproducts").get( getProducts);

// huns --
router.route("/product/delete/:id").delete(verifyJWT, deleteProduct)


export default router;
