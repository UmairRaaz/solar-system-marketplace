import { Router } from "express";
import { adminLogin, adminRegister, getUser, logOutUser, userLogin, userRegister } from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/userauth.middleware.js";
import { adminAuth } from "../middlewares/adminAuth.js";
const router = Router()

//authenciation
router.route("/register").post(userRegister)
router.route("/login").post(userLogin)
router.route('/admin/register').post(adminRegister);
router.route('/admin/login').post(adminLogin);
router.route("/user/logout").get(verifyJWT, logOutUser)


router.route("/user").get(verifyJWT, getUser)
// router.route("/user/admin/logout").get(verifyJWT, logOutUser)


export default router