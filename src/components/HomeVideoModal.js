import React, { useState, useEffect } from "react";
import axios from "axios";

const HomeVideoModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    videoUrl: "",
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
      setFormData(response.data);
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
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
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
          <div>
            <label className="block text-sm font-medium mb-1">Video URL</label>
            <input
              type="text"
              value={formData.videoUrl}
              onChange={(e) =>
                setFormData({ ...formData, videoUrl: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

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
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Video Settings */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Video Settings
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="mr-2"
                />
                Active
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.autoplay}
                  onChange={(e) =>
                    setFormData({ ...formData, autoplay: e.target.checked })
                  }
                  className="mr-2"
                />
                Autoplay
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.muted}
                  onChange={(e) =>
                    setFormData({ ...formData, muted: e.target.checked })
                  }
                  className="mr-2"
                />
                Muted
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.loop}
                  onChange={(e) =>
                    setFormData({ ...formData, loop: e.target.checked })
                  }
                  className="mr-2"
                />
                Loop
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.controls}
                  onChange={(e) =>
                    setFormData({ ...formData, controls: e.target.checked })
                  }
                  className="mr-2"
                />
                Controls
              </label>
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

export default HomeVideoModal;
