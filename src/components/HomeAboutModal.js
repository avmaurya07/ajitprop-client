import React, { useState, useEffect } from "react";
import axios from "axios";
import ImageUploader from "./ImageUploader";

const HomeAboutModal = ({ isOpen, onClose, onSave }) => {
  const frontendUrl =
    process.env.REACT_APP_FRONTEND_URL || "http://localhost:3001";
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    features: [],
    counterValue: "",
    counterLabel: "",
    phoneNumber: "",
    mainImage: "",
    secondaryImage: "",
    rightShapeImage: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAboutData();
    }
  }, [isOpen]);

  const fetchAboutData = async () => {
    try {
      const response = await axios.get("/api/home-about");
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching about data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/home-about", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving about data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = { ...updatedFeatures[index], text: value };
    setFormData({ ...formData, features: updatedFeatures });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [
        ...formData.features,
        { text: "", order: formData.features.length + 1 },
      ],
    });
  };

  const removeFeature = (index) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updatedFeatures });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Home About Section</h2>
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
              rows="4"
              required
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium mb-2">Features</label>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={feature.text}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Feature text"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Feature
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Counter Value
              </label>
              <input
                type="text"
                value={formData.counterValue}
                onChange={(e) =>
                  setFormData({ ...formData, counterValue: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Counter Label
              </label>
              <input
                type="text"
                value={formData.counterLabel}
                onChange={(e) =>
                  setFormData({ ...formData, counterLabel: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Main Image
              </label>
              {formData.mainImage && (
                <div className="mb-2">
                  <img
                    src={
                      formData.mainImage.includes("http")
                        ? formData.mainImage
                        : `${frontendUrl}/${formData.mainImage}`
                    }
                    alt="Logo"
                    className="w-20 h-10 object-contain"
                  />
                </div>
              )}
              <ImageUploader
                onUploadSuccess={(urls) =>
                  setFormData({ ...formData, mainImage: urls[0] })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Secondary Image
              </label>
              {formData.secondaryImage && (
                <div className="mb-2">
                  <img
                    src={
                      formData.secondaryImage.includes("http")
                        ? formData.secondaryImage
                        : `${frontendUrl}/${formData.secondaryImage}`
                    }
                    alt="Secondary"
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
              )}
              <ImageUploader
                onUploadSuccess={(urls) =>
                  setFormData({ ...formData, secondaryImage: urls[0] })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Right Shape Image
              </label>
              {formData.rightShapeImage && (
                <div className="mb-2">
                  <img
                    src={
                      formData.rightShapeImage.includes("http")
                        ? formData.rightShapeImage
                        : `${frontendUrl}/${formData.rightShapeImage}`
                    }
                    alt="Right Shape"
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
              )}
              <ImageUploader
                onUploadSuccess={(urls) =>
                  setFormData({ ...formData, rightShapeImage: urls[0] })
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

export default HomeAboutModal;
