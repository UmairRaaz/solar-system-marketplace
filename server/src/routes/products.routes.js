import { Router } from "express";
import { addProduct, updateProduct, getAllProducts, getProduct } from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/userauth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/product/add").post(verifyJWT, upload.single('images'), addProduct);
router.route("/product/update/:id").put(verifyJWT, upload.single('images'), updateProduct);
router.route("/products").get(verifyJWT, getAllProducts);
router.route("/product/:id").get(verifyJWT, getProduct);

export default router;
