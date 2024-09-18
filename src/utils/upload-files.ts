export const uploadFile = (
  file: File,
  onProgress: (progressEvent: ProgressEvent) => void
): Promise<{ url: string }> => {
  return new Promise((resolve, reject) => {
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

    const xhr = new XMLHttpRequest();

    xhr.open("POST", uploadUrl, true);

    // Set up the onload handler
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        if (data.error) {
          reject(new Error(data.error.message));
        } else {
          resolve({ url: data.secure_url });
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    // Set up the onerror handler
    xhr.onerror = () => {
      reject(new Error("Network error"));
    };

    // Set up the onprogress handler
    xhr.upload.onprogress = onProgress;

    // Send the request
    xhr.send(formData);
  });
};
