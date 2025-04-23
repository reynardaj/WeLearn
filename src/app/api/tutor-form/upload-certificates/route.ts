import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    // Accept single or multiple certificates
    const files = formData.getAll("certificates").filter(Boolean) as File[];
    console.log("[API] formData keys:", Array.from(formData.keys()));
    console.log("[API] files received:", files.map(f => ({ name: f.name, type: f.type, size: f.size })));

    if (!files.length) {
      console.error("No certificates uploaded. formData keys:", Array.from(formData.keys()));
      return NextResponse.json({ error: "No certificates uploaded" }, { status: 400 });
    }

    // Optionally validate file types and sizes (example: PDF, max 5MB)
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        console.error("Invalid file type:", file.name, file.type);
        return NextResponse.json({ error: `Invalid file type: ${file.name}` }, { status: 400 });
      }
      if (file.size > maxFileSize) {
        console.error("File too large:", file.name, file.size);
        return NextResponse.json({ error: `File too large: ${file.name}` }, { status: 400 });
      }
    }

    // Check for blob token
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("Missing blob token in backend environment.");
      return NextResponse.json({ error: "Missing blob token in backend environment." }, { status: 500 });
    }

    // Upload each certificate to Vercel Blob under 'tutor-certificates/'
    const uploadResults = [];
    for (const file of files) {
      try {
        const blob = await put(`tutor-certificates/${file.name}`, file, {
          access: "public",
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        uploadResults.push({ name: file.name, url: blob.url });
      } catch (err) {
        console.error(`Failed to upload certificate: ${file.name}`, err);
        return NextResponse.json({ error: `Failed to upload certificate: ${file.name}` }, { status: 500 });
      }
    }

    console.log("[API] Upload results:", uploadResults);
    return NextResponse.json({ certificates: uploadResults });
  } catch (error) {
    console.error("Error uploading certificates to Vercel Blob:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}