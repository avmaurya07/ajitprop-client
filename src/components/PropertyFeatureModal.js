import React, { useState, useEffect } from "react";
import axios from "axios";
import ImageUploader from "./ImageUploader";

const PropertyFeatureModal = ({ isOpen, onClose, onSave }) => {
  const frontendUrl =
    process.env.REACT_APP_FRONTEND_URL || "http://localhost:3001";
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    buttonText: "",
    buttonUrl: "",
    featureImage: "",
    backgroundImage: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchFeatureData();
    }
  }, [isOpen]);

  const fetchFeatureData = async () => {
    try {
      const response = await axios.get("/api/property-feature");
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching feature data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/property-feature", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving feature data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Property Feature Section</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-2 border rounded"
              rows="3"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) =>
                  setFormData({ ...formData, buttonText: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Button URL
              </label>
              <input
                type="text"
                value={formData.buttonUrl}
                onChange={(e) =>
                  setFormData({ ...formData, buttonUrl: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Feature Image
              </label>
              {formData.featureImage && (
                <div className="mb-2">
                  <img
                    src={
                      formData.featureImage.includes("http")
                        ? formData.featureImage
                        : `${frontendUrl}/${formData.featureImage}`
                    }
                    alt="Logo"
                    className="w-20 h-10 object-contain"
                  />
                </div>
              )}
              <ImageUploader
                onUploadSuccess={(urls) =>
                  setFormData({ ...formData, featureImage: urls[0] })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Background Image
              </label>
              {formData.backgroundImage && (
                <div className="mb-2">
                  <img
                    src={
                      formData.backgroundImage.includes("http")
                        ? formData.backgroundImage
                        : `${frontendUrl}/${formData.backgroundImage}`
                    }
                    alt="Background"
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
              )}
              <ImageUploader
                onUploadSuccess={(urls) =>
                  setFormData({ ...formData, backgroundImage: urls[0] })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyFeatureModal;
