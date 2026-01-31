import React, { useState, useEffect } from "react";
import axios from "axios";

const HomeVideoModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    videoUrl: [],
    title: "",
    description: "",
    isActive: true,
    autoplay: true,
    muted: true,
    loop: true,
    controls: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchVideoData();
    }
  }, [isOpen]);

  const fetchVideoData = async () => {
    try {
      const response = await axios.get("/api/home-video");
      const data = response.data;
      setFormData({
        ...data,
        videoUrl: Array.isArray(data.videoUrl) ? data.videoUrl : [],
      });
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/home-video", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving video data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Home Video Section</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            {/* <div>
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
              />
            </div> */}
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium">Video URLs</label>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    videoUrl: [...formData.videoUrl, ""],
                  })
                }
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Video
              </button>
            </div>
            {formData.videoUrl.map((url, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    const newUrls = [...formData.videoUrl];
                    newUrls[index] = e.target.value;
                    setFormData({ ...formData, videoUrl: newUrls });
                  }}
                  className="flex-1 p-2 border rounded"
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    const newUrls = formData.videoUrl.filter(
                      (_, i) => i !== index,
                    );
                    setFormData({ ...formData, videoUrl: newUrls });
                  }}
                  className="px-3 py-1 text-red-500 border border-red-500 rounded hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {["isActive", "autoplay", "muted", "loop", "controls"].map(
              (field) => (
                <label
                  key={field}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </span>
                </label>
              ),
            )}
          </div> */}

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

export default HomeVideoModal;
