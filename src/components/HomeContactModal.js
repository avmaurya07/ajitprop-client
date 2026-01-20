import React, { useState, useEffect } from "react";
import axios from "axios";

const HomeContactModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    mapEmbedUrl: "",
    formCategories: [],
    submitButtonText: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchContactData();
    }
  }, [isOpen]);

  const fetchContactData = async () => {
    try {
      const response = await axios.get("/api/home-contact");
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching contact data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/home-contact", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving contact data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (index, key, value) => {
    const updatedCategories = [...formData.formCategories];
    updatedCategories[index] = { ...updatedCategories[index], [key]: value };
    setFormData({ ...formData, formCategories: updatedCategories });
  };

  const addCategory = () => {
    setFormData({
      ...formData,
      formCategories: [...formData.formCategories, { name: "", value: "" }],
    });
  };

  const removeCategory = (index) => {
    const updatedCategories = formData.formCategories.filter(
      (_, i) => i !== index,
    );
    setFormData({ ...formData, formCategories: updatedCategories });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Home Contact Section</h2>
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
              Map Embed URL
            </label>
            <input
              type="text"
              value={formData.mapEmbedUrl}
              onChange={(e) =>
                setFormData({ ...formData, mapEmbedUrl: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Submit Button Text
            </label>
            <input
              type="text"
              value={formData.submitButtonText}
              onChange={(e) =>
                setFormData({ ...formData, submitButtonText: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Form Categories */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Form Categories
            </label>
            {formData.formCategories.map((category, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={category.name}
                  onChange={(e) =>
                    handleCategoryChange(index, "name", e.target.value)
                  }
                  className="flex-1 p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Category Value"
                  value={category.value}
                  onChange={(e) =>
                    handleCategoryChange(index, "value", e.target.value)
                  }
                  className="flex-1 p-2 border rounded"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addCategory}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Category
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

export default HomeContactModal;
