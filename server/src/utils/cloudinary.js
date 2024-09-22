import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINAR_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloudinary =  async (localFilePath) => {
    try {
        if(!localFilePath) return
        const response = await cloudinary.uploader.upload(localFilePath, {resource_type: "auto"});
        fs.unlinkSync(localFilePath)

        return response
    } catch (error) {
        console.log("error on cloudinary", error)
        fs.unlinkSync(localFilePath)
        return null
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
       const result  = await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.log("error while deleting", error)
        return null
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}