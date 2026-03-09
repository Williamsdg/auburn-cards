import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export async function uploadImage(file: string, folder: string = "auburn-cards") {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    transformation: [
      { width: 1200, height: 1200, crop: "limit", quality: "auto" },
    ],
  });
  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function deleteImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}
