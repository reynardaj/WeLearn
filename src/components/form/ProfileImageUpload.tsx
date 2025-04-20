"use client";

import React, { useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { TextMd, TextSm } from "../Text";
import { Upload } from "lucide-react";

interface ProfileImageUploadProps {
  onImageChange: (file: File | string | null) => void;
  uploadStatus?: string;
  defaultImageUrl?: string;
  loading?: boolean;
}

const MAX_FILE_SIZE_MB = 2;
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

export default function ProfileImageUpload({
  onImageChange,
  uploadStatus,
  defaultImageUrl,
  loading = false,
}: ProfileImageUploadProps) {
  const [images, setImages] = useState<ImageListType>([]);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (imageList: ImageListType) => {
    setError(null);
    setImages(imageList);
    if (imageList.length > 0) {
      onImageChange(imageList[0].file ?? imageList[0].dataURL ?? null);
    } else {
      onImageChange(null);
    }
  };

  const handleError = (err: any) => {
    if (err?.maxFileSize) {
      setError("File too large (max 2MB)");
    } else if (err?.acceptType) {
      setError("Invalid file type (JPG/PNG only)");
    } else {
      setError("Image upload error");
    }
  };

  // For accessibility: fallback initials if no image
  const getInitials = () => "U";

  // Spinner for loading state
  const Spinner = () => (
    <svg
      className="animate-spin h-6 w-6 text-primary mx-auto"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
      />
    </svg>
  );

  const avatarUrl = images[0]?.dataURL || defaultImageUrl || "";

  return (
    <div className="space-y-2 w-full flex  items-center">
      <ImageUploading
        value={images}
        onChange={handleChange}
        maxNumber={1}
        dataURLKey="dataURL"
        acceptType={["jpg", "png", "jpeg"]}
        maxFileSize={MAX_FILE_SIZE_MB * 1024 * 1024}
        onError={handleError}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemove,
          dragProps,
          isDragging,
        }) => (
          <div className="relative flex  items-center">
            {/* Avatar Frame */}
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-md bg-container flex items-center justify-center overflow-hidden border border-gray-300 transition-shadow ${
                isDragging ? "ring-2 ring-primary ring-offset-2" : ""
              }`}
              style={{ minWidth: 100, minHeight: 100 }}
              {...dragProps}
              tabIndex={0}
              aria-label="Profile image drop area"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onImageUpload();
              }}
            >
              {avatarUrl ? (
                <div className="relative group w-full h-full">
                  <img
                    src={avatarUrl}
                    alt="Profile preview"
                    className="object-cover w-full h-full"
                  />
                  {/* Hover overlay with pencil icon */}
                  <button
                    type="button"
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    aria-label="Change profile image"
                    onClick={onImageUpload}
                    tabIndex={0}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <button
                    type="button"
                    className="cursor-pointer  text-text h-full w-full flex justify-center items-center p-2   focus:outline-none"
                    aria-label="Upload profile picture"
                    onClick={onImageUpload}
                    tabIndex={0}
                  >
                    <Upload className="h-5 w-5" />
                  </button>
                  <TextSm className="!text-gray-500 text-center !text-xs">
                    Upload Image
                  </TextSm>
                </div>
              )}
              {/* Spinner */}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 rounded-full">
                  <Spinner />
                </div>
              )}
            </div>
            {/* Error Message */}
            {error && (
              <p className="text-error text-sm mt-2" role="alert">
                {error}
              </p>
            )}
            <div className="flex flex-col pl-3 justify-center gap-0">
              <label className="block text-sm font-medium text-text mb-0">
                <TextMd>Profile Image</TextMd>
              </label>
              <label className="block text-sm font-medium text-text mb-0">
                <TextMd>Requirements</TextMd>
              </label>
              {/* Upload Status */}
              {uploadStatus && !error && (
                <p className="text-green-500 text-sm mt-2 ">{uploadStatus}</p>
              )}
              {/* Instructions */}
              <p className="text-xs text-gray-500 mt-1">
                Formats Accepted: JPG, PNG, JPEG
                <br />
                Max File Size: 5MB
                <br />
                Clear & Professional: Ensure your face is well-lit and clearly
                visible
                <br />
                Plain Background: Use a solid or neutral background for a clean
                look
              </p>
            </div>
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
