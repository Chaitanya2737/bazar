import cloudinary from "./cloudinaryConfig";

export async function multerMiddleware(file, filename) {
  try {
    if (!file) {
      throw { error: "No file provided", status: 400 };
    }

    const folderName = filename?.trim() || "User";

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: folderName },
        (error, result) => {
          try {
            if (error) {
              console.log("Error from Cloudinary:", error);
              const err = new Error(error.message || "Cloudinary upload failed");
              err.status = 500;
              reject(err);
            } else {
              resolve(result.secure_url);
            }
          } catch (internalError) {
            console.log("Unexpected stream error:", internalError);
            reject(new Error("Unexpected error in upload stream"));
          }
        }
      );
      stream.end(buffer);
    });
  } catch (error) {
    throw { error: error.message || "Internal Server Error", status: error.status || 500 };
  }
}
