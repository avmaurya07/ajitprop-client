import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ImageUploader from "../components/ImageUploader";

function AddProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    // slug removed, auto-generated
    name: "",
    price: "",
    location: "",
    type: "apartment",
    status: "available",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
    metaDescription: "",
    features: "",
    images: [],
    videos: [],
    featured: false,
    available: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const featuresArray = formData.features
        ? formData.features.split(",").map((f) => f.trim())
        : [];
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/properties`,
        {
          ...formData,
          price: formData.price === "" ? 0 : Number(formData.price),
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          area: Number(formData.area),
          features: featuresArray,
          images: formData.images,
          videos: formData.videos,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      navigate("/properties");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Add New Property
      </h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Property Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Slug field removed, auto-generated on backend */}

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Location <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Type <span className="text-red-600">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Status <span className="text-red-600">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                Featured Property
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Mark this property as featured to highlight it
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
                Available for Booking
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Uncheck to mark this property as unavailable
              </p>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Area (sqft)
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-sm font-medium">
                  Description
                  <span className="text-red-600">*</span>
                </label>
                {/* <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {previewMode ? "Edit" : "Preview"}
                </button> */}
              </div>
              <CKEditor
                editor={ClassicEditor}
                data={formData.description}
                config={{
                  ckfinder: {
                    uploadUrl: `${process.env.REACT_APP_API_URL}/api/upload/ckeditor`,
                  },
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setFormData((prev) => ({ ...prev, description: data }));
                }}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Meta Description (for SEO)
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows="3"
                maxLength="160"
                placeholder="Brief description for search engines (max 160 characters)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.metaDescription.length}/160 characters
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Features (comma separated)
              </label>
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="Pool, Garage, Garden, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Main Image <span className="text-red-600">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                This image will be displayed as the primary image for this
                property
              </p>
              <ImageUploader
                multiple={false}
                onUploadSuccess={(urls) => {
                  setFormData((prev) => {
                    // Remove old main image if exists, then add new one at index 0
                    const otherImages = prev.images.slice(1);
                    return {
                      ...prev,
                      images: [urls[0], ...otherImages],
                    };
                  });
                }}
              />
              {formData.images.length > 0 && formData.images[0] && (
                <div className="mt-3">
                  <div className="relative group inline-block">
                    <img
                      src={formData.images[0]}
                      alt="Main Property Image"
                      className="w-48 h-32 object-cover rounded border-2 border-blue-500"
                    />
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Main Image
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          images: prev.images.slice(1),
                        }));
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Additional Images
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Upload additional images for the property gallery
              </p>
              <ImageUploader
                multiple={true}
                onUploadSuccess={(urls) => {
                  setFormData((prev) => {
                    // Keep main image at index 0, add new images after
                    const mainImage = prev.images[0] ? [prev.images[0]] : [];
                    const otherImages = prev.images.slice(1);
                    return {
                      ...prev,
                      images: [...mainImage, ...otherImages, ...urls],
                    };
                  });
                }}
              />
              {formData.images.length > 1 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">
                    Additional Images ({formData.images.length - 1}):
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.slice(1).map((url, idx) => {
                      const index = idx + 1; // Actual index in the images array
                      return (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Property ${index}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                images: prev.images.filter(
                                  (_, i) => i !== index,
                                ),
                              }));
                            }}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-sm font-medium">
                  Video URLs
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      videos: [...formData.videos, ""],
                    })
                  }
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  + Add Video
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Add YouTube or direct video URLs for this property
              </p>
              {formData.videos.length === 0 ? (
                <div className="text-sm text-gray-500 italic py-2">
                  No videos added yet. Click "+ Add Video" to add one.
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.videos.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => {
                          const newVideos = [...formData.videos];
                          newVideos[index] = e.target.value;
                          setFormData({ ...formData, videos: newVideos });
                        }}
                        placeholder="https://www.youtube.com/embed/VIDEO_ID"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newVideos = formData.videos.filter(
                            (_, i) => i !== index,
                          );
                          setFormData({ ...formData, videos: newVideos });
                        }}
                        className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {loading ? "Creating..." : "Create Property"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/properties")}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProperty;
