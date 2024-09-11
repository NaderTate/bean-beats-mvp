import React, { useState } from "react";
import { BsCloudUpload } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx"; // Importing the cross icon
import Spinner from "@/components/shared/spinner"; // Assuming Spinner is already implemented
import { uploadFile } from "@/utils/upload-files"; // Function to handle file upload

interface FileUploaderProps {
  label?: string;
  errorMessage?: string;
  defaultImageUrl?: string;
  onFileUpload: (url: string | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  onFileUpload,
  errorMessage,
  defaultImageUrl,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | undefined>(
    defaultImageUrl
  ); // State to hold the uploaded image URL

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadFile(file); // Assuming uploadFile returns the file URL
      setUploadedImageUrl(url.url); // Set the uploaded image URL
      onFileUpload(url.url); // Pass the URL to the parent
    } catch (error) {
      console.error("File upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Handle file selection via browse button
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setUploadedImageUrl(undefined); // Reset the uploaded image state
    onFileUpload(null); // Pass null to the parent
  };

  return (
    <>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="w-full max-w-md mx-auto">
        {/* If an image is uploaded, display it */}
        {uploadedImageUrl ? (
          <div className="relative">
            <img
              alt="Uploaded"
              className="w-full h-auto rounded-lg"
              src={uploadedImageUrl}
            />
            {/* Remove image button */}
            <button
              type="button"
              className="absolute top-0 right-0 bg-gray-200 rounded-full p-1"
              onClick={handleRemoveImage}
              aria-label="Remove image"
            >
              <RxCross2 className="text-red-500 text-xl" />
            </button>
          </div>
        ) : (
          <label
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer block ${
              dragging ? "border-teal-400" : "border-gray-300"
            } ${isUploading ? "bg-gray-100" : "bg-teal-50"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : (
              <div>
                <BsCloudUpload className="mx-auto text-teal-400 text-3xl" />
                <p className="mt-4 text-teal-600">
                  Drop a file here to upload, or click to browse
                </p>
              </div>
            )}
            {/* Invisible file input */}
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>
        )}
        {errorMessage && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>
    </>
  );
};

export default FileUploader;
