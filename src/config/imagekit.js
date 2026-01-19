import { IKContext, IKUpload } from "imagekitio-react";

const publicKey = process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT;

const authenticator = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/upload/auth`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to get authentication parameters");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

export { IKContext, IKUpload, publicKey, urlEndpoint, authenticator };
