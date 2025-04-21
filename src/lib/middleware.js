import cloudinary from "./cloudinaryConfig";

export async function multerMiddleware(file, filename) {
  try {
    if (!file) {
      throw { error: "No file provided", status: 400 };
    }

    // Trim filename (businessName) to avoid Cloudinary errors
    const folderName = filename?.trim() || "User";

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: folderName },
        (error, result) => {
          if (error){
            console.log(error , "error coming from here");
            reject({ error: error.message, status: 500 });
          }
          else resolve(result.secure_url);
        }
      );
      stream.end(buffer);
    });
  } catch (error) {
    throw { error: error.message || "Internal Server Error", status: 500 };
  }
}