"use client";

import React, { useState } from "react";
import { Button } from "@/components/Buttons";
import { Upload } from "lucide-react";
import { TextMd } from "../Text";

interface CertificatesUploadProps {
  onCertificatesUpload: (files: File[]) => void;
  uploadStatus: string;
}

export default function CertificatesUpload({
  onCertificatesUpload,
  uploadStatus,
}: CertificatesUploadProps) {
  const handleCertificatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      onCertificatesUpload(fileArray);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text mb-2">
        <TextMd>Upload Certificates</TextMd>
      </label>
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="application/pdf,image/*"
          multiple
          className="w-full p-2 border border-gray-300 rounded-md"
          onChange={handleCertificatesChange}
          required
        />
        <button
          type="button"
          onClick={() => onCertificatesUpload([])}
          className="text-md flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <Upload className="h-4 w-4" />
          Clear All
        </button>
      </div>
      {uploadStatus && <p className="text-green-500 text-sm">{uploadStatus}</p>}
    </div>
  );
}
