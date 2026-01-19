import React, { useState } from "react";
import axios from "axios";

function ImageUploader({ onUploadSuccess, multiple = false }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      if (multiple) {
        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/upload/multiple`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.data.success) {
          const urls = response.data.files.map((f) => f.url);
          onUploadSuccess(urls);
        }
      } else {
        formData.append("file", files[0]);

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.data.success) {
          onUploadSuccess([response.data.url]);
        }
      }
    } catch (error) {
      setUploadError(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        multiple={multiple}
        accept="image/*"
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
      />
      {uploading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
      {uploadError && (
        <p className="text-sm text-red-600 mt-2">{uploadError}</p>
      )}
    </div>
  );
}

export default ImageUploader;
