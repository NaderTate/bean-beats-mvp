import React, { useState } from "react";
import { useTranslations } from "next-intl";

import Spinner from "@/components/shared/spinner";

import { RxCross2 } from "react-icons/rx";
import { BsCloudUpload } from "react-icons/bs";

import { uploadFile } from "@/utils/upload-files";

interface FileUploaderProps {
  label?: string;
  errorMessage?: string;
  defaultImageUrl?: string;
  defaultAudioUrl?: string; // New prop for default audio URL
  accept?: string; // New prop to specify file types
  onFileUpload: (
    url: string | null,
    fileType: "image" | "audio" | null,
    duration?: number
  ) => void; // Modified callback to pass file type and duration
}

const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  onFileUpload,
  errorMessage,
  defaultImageUrl,
  defaultAudioUrl, // Receiving the default audio URL
  accept = "image/*,audio/*", // Default accept value for images and audio
}) => {
  const t = useTranslations();
  const [isUploading, setIsUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | undefined>(
    defaultImageUrl
  ); // State for uploaded image URL
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | undefined>(
    defaultAudioUrl
  ); // State for uploaded audio URL
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0); // Reset progress
    try {
      const url = await uploadFile(file, (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      const fileType = file.type.startsWith("image")
        ? "image"
        : file.type.startsWith("audio")
        ? "audio"
        : null;

      if (fileType === "image") {
        setUploadedImageUrl(url.url);
        setUploadedAudioUrl(undefined);
        onFileUpload(url.url, "image");
      } else if (fileType === "audio") {
        setUploadedAudioUrl(url.url);
        setUploadedImageUrl(undefined);
        getAudioDuration(url.url);
      }
    } catch (error) {
      console.error("File upload failed", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Get audio duration
  const getAudioDuration = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.onloadedmetadata = () => {
      const duration = audio.duration;
      onFileUpload(audioUrl, "audio", duration); // Pass the URL, file type, and duration to the parent
    };
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

  // Handle image or audio removal
  const handleRemoveFile = () => {
    setUploadedImageUrl(undefined); // Reset the uploaded image state
    setUploadedAudioUrl(undefined); // Reset the uploaded audio state
    onFileUpload(null, null); // Pass null to the parent
  };

  return (
    <>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {t(label)}
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
              onClick={handleRemoveFile}
              aria-label="Remove image"
            >
              <RxCross2 className="text-red-500 text-xl" />
            </button>
          </div>
        ) : uploadedAudioUrl ? ( // If an audio file is uploaded, display audio player
          <div className="relative">
            <audio controls className="w-full">
              <source src={uploadedAudioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            {/* Remove audio button */}
            <button
              type="button"
              className="absolute top-0 right-0 bg-gray-200 rounded-full p-1"
              onClick={handleRemoveFile}
              aria-label="Remove audio"
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
              <div className="flex flex-col items-center">
                <Spinner />
                <p className="mt-2 text-teal-600">
                  {t("Uploading...")} {uploadProgress}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-teal-600 h-2.5 rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div>
                <BsCloudUpload className="mx-auto text-teal-400 text-3xl" />
                <p className="mt-4 text-teal-600">
                  {t("Drop a file here to upload, or click to browse")}
                </p>
              </div>
            )}
            {/* Invisible file input */}
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept={accept} // Set the file types using the accept prop
            />
          </label>
        )}
        {errorMessage && (
          <p className="mt-2 text-sm text-red-600">{t(errorMessage)}</p>
        )}
      </div>
    </>
  );
};

export default FileUploader;
