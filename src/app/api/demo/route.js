import cloudinary from "@/lib/cloudinaryConfig";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("demo");

        if (!file) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: "No file provided" 
                },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
    
        console.log("Uploading to Cloudinary...");
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { 
                    folder: "next-cloudinary-uploads",
                    resource_type: "auto",
                    allowed_formats: ["jpg", "png", "webp"], 
                    type: "upload"
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        reject(error);
                    } else {
                        console.log("Upload successful");
                        resolve(result);
                    }
                }
            );
            uploadStream.end(buffer);
        });
    
        const businessIconUrl = uploadResult?.secure_url;
        console.log("File uploaded to:", businessIconUrl);
        
        return NextResponse.json(
            { 
                success: true, 
                message: "File uploaded successfully",
                url: businessIconUrl
            },
            { status: 201 }
        );
    } catch (uploadError) {
        console.error("File upload failed:", uploadError);
        return NextResponse.json(
            { 
                success: false, 
                message: "File upload failed",
                error: uploadError.message 
            },
            { status: 500 }
        );
    }
}