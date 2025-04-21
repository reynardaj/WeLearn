import React, { useRef, useState } from "react";
import { TextMd, TextSm } from "../Text";
import {
  CloudUpload,
  FileText,
  Image as ImageIcon,
  XCircle,
} from "lucide-react";

interface CertificatesUploadProps {
  onFilesUpload: (files: File[]) => void;
}

const CertificatesUpload: React.FC<CertificatesUploadProps> = ({
  onFilesUpload,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    const validFiles = files.filter((file) => validTypes.includes(file.type));
    if (validFiles.length !== files.length) {
      alert("Some files were not valid (PDF, JPEG, or PNG only). Only valid files will be added.");
    }
    // Prevent duplicates by name
    const newFiles = validFiles.filter(
      (file) => !uploadedFiles.some((f) => f.name === file.name)
    );
    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    onFilesUpload(updatedFiles);
  };

  const handleDiscard = (fileName: string) => {
    const updatedFiles = uploadedFiles.filter((file) => file.name !== fileName);
    setUploadedFiles(updatedFiles);
    onFilesUpload(updatedFiles);
    if (updatedFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type === "application/pdf")
      return <FileText className="w-5 h-5 text-gray-500 mr-2" />;
    if (file.type.startsWith("image/"))
      return <ImageIcon className="w-5 h-5 text-gray-500 mr-2" />;
    return <FileText className="w-5 h-5 text-gray-500 mr-2" />;
  };

  return (
    <div>
      <TextMd className="mb-2">Upload Your Certificates</TextMd>
      <div
        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg bg-white transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-text ${
          isDragging ? "border-blue-500 bg-blue-50" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick();
          }
        }}
        aria-label="Upload certificates by dragging or clicking here"
      >
        <CloudUpload
          className="stroke-[1] w-8 h-8 text-gray-400 mb-2"
          aria-hidden="true"
        />
        <TextSm className="text-gray-500">Drag or upload files here (PDF, JPEG, PNG)</TextSm>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,image/jpeg,image/png"
          className="hidden"
          aria-hidden="true"
          multiple
        />
      </div>
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded border border-gray-200"
            >
              <div className="flex items-center">
                {getFileIcon(file)}
                <span className="text-sm text-gray-700 truncate max-w-xs">
                  {file.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDiscard(file.name)}
                className="ml-4 p-1 rounded-full hover:bg-gray-200 transition-colors"
                aria-label={`Discard uploaded certificate ${file.name}`}
              >
                <XCircle className="w-5 h-5 text-text" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesUpload;
