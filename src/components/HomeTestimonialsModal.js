import React, { useState, useEffect } from "react";
import axios from "axios";

const HomeTestimonialsModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    clientReviewCount: "",
    clientReviewLabel: "",
    quoteIcon: "",
    clientInfoImage: "",
    testimonials: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTestimonialsData();
    }
  }, [isOpen]);

  const fetchTestimonialsData = async () => {
    try {
      const response = await axios.get("/api/home-testimonials");
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching testimonials data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/home-testimonials", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving testimonials data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestimonialChange = (index, field, value) => {
    const updatedTestimonials = [...formData.testimonials];
    updatedTestimonials[index] = {
      ...updatedTestimonials[index],
      [field]: value,
    };
    setFormData({ ...formData, testimonials: updatedTestimonials });
  };

  const addTestimonial = () => {
    setFormData({
      ...formData,
      testimonials: [
        ...formData.testimonials,
        {
          name: "",
          position: "",
          review: "",
          rating: 5,
          image: "/assets/img/home-1/testimonial/client-info-right-img.png",
          order: formData.testimonials.length + 1,
          isActive: true,
        },
      ],
    });
  };

  const removeTestimonial = (index) => {
    const updatedTestimonials = formData.testimonials.filter(
      (_, i) => i !== index,
    );
    setFormData({ ...formData, testimonials: updatedTestimonials });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Home Testimonials Section</h2>
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
                Client Review Count
              </label>
              <input
                type="text"
                value={formData.clientReviewCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    clientReviewCount: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Client Review Label
              </label>
              <input
                type="text"
                value={formData.clientReviewLabel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    clientReviewLabel: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Quote Icon URL
              </label>
              <input
                type="text"
                value={formData.quoteIcon}
                onChange={(e) =>
                  setFormData({ ...formData, quoteIcon: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Client Info Image URL
              </label>
              <input
                type="text"
                value={formData.clientInfoImage}
                onChange={(e) =>
                  setFormData({ ...formData, clientInfoImage: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Testimonials */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Testimonials
            </label>
            {formData.testimonials.map((testimonial, index) => (
              <div key={index} className="border rounded p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={testimonial.name}
                      onChange={(e) =>
                        handleTestimonialChange(index, "name", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      value={testimonial.position}
                      onChange={(e) =>
                        handleTestimonialChange(
                          index,
                          "position",
                          e.target.value,
                        )
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">
                    Review
                  </label>
                  <textarea
                    value={testimonial.review}
                    onChange={(e) =>
                      handleTestimonialChange(index, "review", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                    rows="3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonial.rating}
                      onChange={(e) =>
                        handleTestimonialChange(
                          index,
                          "rating",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={testimonial.image}
                      onChange={(e) =>
                        handleTestimonialChange(index, "image", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Order
                    </label>
                    <input
                      type="number"
                      value={testimonial.order}
                      onChange={(e) =>
                        handleTestimonialChange(
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
                <div className="flex items-center gap-4 mb-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={testimonial.isActive}
                      onChange={(e) =>
                        handleTestimonialChange(
                          index,
                          "isActive",
                          e.target.checked,
                        )
                      }
                      className="mr-2"
                    />
                    Active
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => removeTestimonial(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Remove Testimonial
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTestimonial}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Testimonial
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

export default HomeTestimonialsModal;
