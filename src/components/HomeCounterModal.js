import React, { useState, useEffect } from "react";
import axios from "axios";

const HomeCounterModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    counters: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCounterData();
    }
  }, [isOpen]);

  const fetchCounterData = async () => {
    try {
      const response = await axios.get("/api/home-counter");
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching counter data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/home-counter", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving counter data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCounterChange = (index, field, value) => {
    const updatedCounters = [...formData.counters];
    updatedCounters[index] = { ...updatedCounters[index], [field]: value };
    setFormData({ ...formData, counters: updatedCounters });
  };

  const addCounter = () => {
    setFormData({
      ...formData,
      counters: [
        ...formData.counters,
        {
          label: "",
          value: "",
          suffix: "",
          order: formData.counters.length + 1,
        },
      ],
    });
  };

  const removeCounter = (index) => {
    const updatedCounters = formData.counters.filter((_, i) => i !== index);
    setFormData({ ...formData, counters: updatedCounters });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Home Counter Section</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Section Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Counters */}
          <div>
            <label className="block text-sm font-medium mb-2">Counters</label>
            {formData.counters.map((counter, index) => (
              <div key={index} className="border rounded p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={counter.label}
                      onChange={(e) =>
                        handleCounterChange(index, "label", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Value
                    </label>
                    <input
                      type="text"
                      value={counter.value}
                      onChange={(e) =>
                        handleCounterChange(index, "value", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Suffix
                    </label>
                    <input
                      type="text"
                      value={counter.suffix}
                      onChange={(e) =>
                        handleCounterChange(index, "suffix", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      placeholder="e.g., +, k"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Order
                    </label>
                    <input
                      type="number"
                      value={counter.order}
                      onChange={(e) =>
                        handleCounterChange(
                          index,
                          "order",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full p-2 border rounded"
                      min="1"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeCounter(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Remove Counter
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addCounter}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Counter
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

export default HomeCounterModal;
