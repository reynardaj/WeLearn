"use client";

import React, { useState } from "react";
import { Button } from "@/components/Buttons";
import { TextMd } from "../Text";

interface ProfileImageUploadProps {
  onImageUpload: (file: File | null) => void;
  uploadStatus: string;
}

export default function ProfileImageUpload({
  onImageUpload,
  uploadStatus,
}: ProfileImageUploadProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text mb-2">
        <TextMd>Profile Image</TextMd>
      </label>
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          className="w-full p-2 border border-gray-300 rounded-md"
          onChange={handleImageChange}
          required
        />
        <button
          type="button"
          onClick={() => onImageUpload(null)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Remove
        </button>
      </div>
      {uploadStatus && <p className="text-green-500 text-sm">{uploadStatus}</p>}
    </div>
  );
}
