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

        // Convert file to base64 string
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64String = buffer.toString('base64');
        const dataUri = `data:${file.type};base64,${base64String}`;
    
        console.log("Uploading to Cloudinary using uploader...");
        
        // Use uploader.upload() instead of upload_stream
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: "next-cloudinary-uploads",
            resource_type: "auto",
            allowed_formats: ["jpg", "png", "webp"],
            type: "upload"
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