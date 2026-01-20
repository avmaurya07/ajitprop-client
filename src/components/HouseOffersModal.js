import React, { useState, useEffect } from "react";
import axios from "axios";

const HouseOffersModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    offers: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchOffersData();
    }
  }, [isOpen]);

  const fetchOffersData = async () => {
    try {
      const response = await axios.get("/api/house-offers");
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching offers data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/house-offers", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving offers data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOfferChange = (index, field, value) => {
    const updatedOffers = [...formData.offers];
    updatedOffers[index] = { ...updatedOffers[index], [field]: value };
    setFormData({ ...formData, offers: updatedOffers });
  };

  const addOffer = () => {
    setFormData({
      ...formData,
      offers: [
        ...formData.offers,
        { name: "", count: "", icon: "", order: formData.offers.length + 1 },
      ],
    });
  };

  const removeOffer = (index) => {
    const updatedOffers = formData.offers.filter((_, i) => i !== index);
    setFormData({ ...formData, offers: updatedOffers });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit House Offers Section</h2>
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

          {/* Offers */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Property Offers
            </label>
            {formData.offers.map((offer, index) => (
              <div key={index} className="border rounded p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={offer.name}
                      onChange={(e) =>
                        handleOfferChange(index, "name", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Count
                    </label>
                    <input
                      type="text"
                      value={offer.count}
                      onChange={(e) =>
                        handleOfferChange(index, "count", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Icon Class
                    </label>
                    <input
                      type="text"
                      value={offer.icon}
                      onChange={(e) =>
                        handleOfferChange(index, "icon", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      placeholder="e.g., flaticon-warehouse"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Order
                    </label>
                    <input
                      type="number"
                      value={offer.order}
                      onChange={(e) =>
                        handleOfferChange(
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
                  onClick={() => removeOffer(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Remove Offer
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addOffer}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Offer
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

export default HouseOffersModal;
