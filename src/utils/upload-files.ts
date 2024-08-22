export const uploadFile = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
  );

  // Determine the resource type based on the file type
  const isImage = file.type.startsWith("image/");
  const uploadUrl = isImage
    ? "https://api.cloudinary.com/v1_1/dshf6vsix/image/upload"
    : "https://api.cloudinary.com/v1_1/dshf6vsix/video/upload";

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return {
    url: data.secure_url,
  };
};
