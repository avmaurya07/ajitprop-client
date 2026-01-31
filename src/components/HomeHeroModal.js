import React, { useState, useEffect } from "react";
import axios from "axios";
import ImageUploader from "./ImageUploader";

const HomeHeroModal = ({ isOpen, onClose, onSave }) => {
  const frontendUrl =
    process.env.REACT_APP_FRONTEND_URL || "http://localhost:3001";
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    backgroundImage: "",
    searchCategories: [],
    searchLocations: [],
    buttonLinks: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchHeroData();
    }
  }, [isOpen]);

  const fetchHeroData = async () => {
    try {
      const response = await axios.get("/api/home-hero");
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching hero data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/home-hero", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving hero data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleArrayChange = (field, index, key, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = { ...updatedArray[index], [key]: value };
    setFormData({ ...formData, [field]: updatedArray });
  };

  const addArrayItem = (field, defaultItem) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], defaultItem],
    });
  };

  const removeArrayItem = (field, index) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updatedArray });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Home Hero Section</h2>
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
                // required
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
                // required
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
              // required
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
                  alt="Logo"
                  className="w-20 h-10 object-contain"
                />
              </div>
            )}
            <ImageUploader
              onUploadSuccess={(urls) =>
                setFormData({ ...formData, backgroundImage: urls[0] })
              }
            />
          </div>

          {/* Search Categories */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Search Categories
            </label>
            {formData.searchCategories.map((category, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={category.name}
                  onChange={(e) =>
                    handleArrayChange(
                      "searchCategories",
                      index,
                      "name",
                      e.target.value,
                    )
                  }
                  className="flex-1 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={category.value}
                  onChange={(e) =>
                    handleArrayChange(
                      "searchCategories",
                      index,
                      "value",
                      e.target.value,
                    )
                  }
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("searchCategories", index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addArrayItem("searchCategories", { name: "", value: "" })
              }
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Category
            </button>
          </div>

          {/* Search Locations */}
          {/* <div>
            <label className="block text-sm font-medium mb-2">
              Search Locations
            </label>
            {formData.searchLocations.map((location, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={location.name}
                  onChange={(e) =>
                    handleArrayChange(
                      "searchLocations",
                      index,
                      "name",
                      e.target.value,
                    )
                  }
                  className="flex-1 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={location.value}
                  onChange={(e) =>
                    handleArrayChange(
                      "searchLocations",
                      index,
                      "value",
                      e.target.value,
                    )
                  }
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("searchLocations", index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addArrayItem("searchLocations", { name: "", value: "" })
              }
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Location
            </button>
          </div> */}

          {/* Button Links */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Button Links
            </label>
            {formData.buttonLinks.map((button, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Text"
                  value={button.text}
                  onChange={(e) =>
                    handleArrayChange(
                      "buttonLinks",
                      index,
                      "text",
                      e.target.value,
                    )
                  }
                  className="flex-1 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="URL"
                  value={button.url}
                  onChange={(e) =>
                    handleArrayChange(
                      "buttonLinks",
                      index,
                      "url",
                      e.target.value,
                    )
                  }
                  className="flex-1 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Icon"
                  value={button.icon}
                  onChange={(e) =>
                    handleArrayChange(
                      "buttonLinks",
                      index,
                      "icon",
                      e.target.value,
                    )
                  }
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("buttonLinks", index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addArrayItem("buttonLinks", { text: "", url: "", icon: "" })
              }
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Button
            </button>
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

export default HomeHeroModal;
