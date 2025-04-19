import React, { useRef, useState } from "react";
import { TextMd, TextSm } from "../Text";
import {
  CloudUpload,
  FileText,
  Image as ImageIcon,
  XCircle,
} from "lucide-react";

interface CertificatesUploadProps {
  onFileUpload: (file: File | null) => void;
}

const CertificatesUpload: React.FC<CertificatesUploadProps> = ({
  onFileUpload,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
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

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const validTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (validTypes.includes(file.type)) {
        setUploadedFile(file);
        onFileUpload(file);
      } else {
        alert("Please upload a valid file (PDF, JPEG, or PNG).");
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const validTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (validTypes.includes(file.type)) {
        setUploadedFile(file);
        onFileUpload(file);
      } else {
        alert("Please upload a valid file (PDF, JPEG, or PNG).");
      }
    }
  };

  const handleDiscard = () => {
    setUploadedFile(null);
    onFileUpload(null);
    if (fileInputRef.current) {
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
        } ${uploadedFile ? "opacity-50 pointer-events-none" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!uploadedFile ? handleClick : undefined}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !uploadedFile) {
            handleClick();
          }
        }}
        aria-label="Upload a certificate by dragging or clicking here"
      >
        <CloudUpload
          className="stroke-[1] w-8 h-8 text-gray-400 mb-2"
          aria-hidden="true"
        />
        <TextSm className="text-gray-500">Drag or upload a file here</TextSm>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,image/jpeg,image/png"
          className="hidden"
          aria-hidden="true"
          disabled={!!uploadedFile}
        />
      </div>
      {uploadedFile && (
        <div className="flex items-center justify-between mt-4 px-3 py-2 bg-gray-50 rounded border border-gray-200">
          <div className="flex items-center">
            {getFileIcon(uploadedFile)}
            <span className="text-sm text-gray-700 truncate max-w-xs">
              {uploadedFile.name}
            </span>
          </div>
          <button
            type="button"
            onClick={handleDiscard}
            className="ml-4 p-1 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Discard uploaded certificate"
          >
            <XCircle className="w-5 h-5 text-text" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CertificatesUpload;
