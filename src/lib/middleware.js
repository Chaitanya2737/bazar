import cloudinary from "./cloudinaryConfig";

/**
 * Uploads a file to Cloudinary
 * @param {File} file - The file to upload
 * @param {string} folderName - The folder name in Cloudinary (default: "User")
 * @returns {Promise<string>} - The secure URL of the uploaded file
 * @throws {Object} - { error: string, status: number }
 */
export async function uploadToCloudinary(file, folderName = "User") {
  try {
    // Validate input
    if (!file) {
      throw { error: "No file provided", status: 400 };
    }

    // Sanitize folder name
    const sanitizedFolderName = folderName
      .trim()
      .replace(/[^a-zA-Z0-9-_]/g, "-") // Replace special chars with hyphens
      .substring(0, 60); // Limit length

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary with additional validation
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: sanitizedFolderName,
        resource_type: "auto", // Auto-detect file type
        allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"], // Restrict formats
        max_file_size: 5 * 1024 * 1024, // 5MB limit
      };

      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject({ 
              error: error.message || "File upload failed", 
              status: 500 
            });
          } else {
            console.log("Upload successful:", result.secure_url);
            resolve(result.secure_url);
          }
        }
      );

      stream.on("error", (error) => {
        console.error("Stream error:", error);
        reject({ error: "File upload stream failed", status: 500 });
      });

      stream.end(buffer);
    });
  } catch (error) {
    console.error("Upload middleware error:", error);
    throw { 
      error: error.error || error.message || "Internal Server Error", 
      status: error.status || 500 
    };
  }
}