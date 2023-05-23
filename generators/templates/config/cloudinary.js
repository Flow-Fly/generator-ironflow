import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		allowed_formats: ["jpg", "png", "gif", "webp", "jpeg"],
		folder: "my-project", // The name of the folder in cloudinary
		// resource_type: 'raw' => this is in case you want to upload other type of files, not just images
	},
});

//                     storage: storage
export default multer({ storage });
