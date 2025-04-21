import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    // Accept single or multiple certificates
    const files = formData.getAll("certificates").filter(Boolean) as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No certificates uploaded" }, { status: 400 });
    }

    // Optionally validate file types and sizes (example: PDF, max 5MB)
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: `Invalid file type: ${file.name}` }, { status: 400 });
      }
      if (file.size > maxFileSize) {
        return NextResponse.json({ error: `File too large: ${file.name}` }, { status: 400 });
      }
    }

    // Check for blob token
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
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

    return NextResponse.json({ certificates: uploadResults });
  } catch (error) {
    console.error("Error uploading certificates to Vercel Blob:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}