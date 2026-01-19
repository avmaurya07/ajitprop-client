import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mediaItems, setMediaItems] = useState([]);
  useEffect(() => {
    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (property) {
      const items = [];

      if (property.images && property.images.length > 0) {
        property.images.forEach((img) =>
          items.push({ type: "image", url: img }),
        );
      }

      if (property.videos && property.videos.length > 0) {
        property.videos.forEach((vid) =>
          items.push({ type: "video", url: vid }),
        );
      }

      setMediaItems(items);
    }
  }, [property]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/properties/${id}`,
      );
      setProperty(response.data);
    } catch (err) {
      setError("Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/properties/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        navigate("/properties");
      } catch (err) {
        setError("Failed to delete property");
      }
    }
  };

  const nextImage = () => {
    if (mediaItems.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === mediaItems.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (mediaItems.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? mediaItems.length - 1 : prev - 1,
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading property details...</div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error || "Property not found"}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/properties"
          className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          ← Back to Properties
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-96 bg-gray-200 flex items-center justify-center relative">
          {mediaItems.length > 0 ? (
            <>
              {mediaItems[currentImageIndex].type === "image" ? (
                <img
                  src={mediaItems[currentImageIndex].url}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <iframe
                  src={mediaItems[currentImageIndex].url}
                  title={property.name}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              {mediaItems.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition"
                  >
                    →
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {mediaItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition ${
                          index === currentImageIndex
                            ? "bg-white w-8"
                            : "bg-white bg-opacity-50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <span className="text-gray-400 text-6xl">🏠</span>
          )}
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-800">
                  {property.name}
                </h1>
                {property.featured && (
                  <span className="px-3 py-1 text-sm font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                    ⭐ Featured
                  </span>
                )}
                {property.available === false && (
                  <span className="px-3 py-1 text-sm font-semibold bg-red-100 text-red-800 rounded-full">
                    Unavailable
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-lg">{property.location}</p>
            </div>
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                property.status === "available"
                  ? "bg-green-100 text-green-700"
                  : property.status === "sold"
                    ? "bg-red-100 text-red-700"
                    : property.status === "rented"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {property.status}
            </span>
          </div>

          <div className="text-3xl font-bold text-blue-600 mb-6">
            ₹{property.price.toLocaleString()}
            {property.pricePeriod && property.pricePeriod !== "total" && (
              <span className="text-xl text-gray-600 font-normal">
                /{property.pricePeriod}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-600 text-sm mb-1">Type</div>
              <div className="font-semibold capitalize">{property.type}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-600 text-sm mb-1">Bedrooms</div>
              <div className="font-semibold">{property.bedrooms}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-600 text-sm mb-1">Bathrooms</div>
              <div className="font-semibold">{property.bathrooms}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-600 text-sm mb-1">Area</div>
              <div className="font-semibold">{property.area} sqft</div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Description
            </h2>
            <div className="prose max-w-none text-gray-700">
              <div
                dangerouslySetInnerHTML={{
                  __html: window.DOMPurify
                    ? window.DOMPurify.sanitize(property.description)
                    : property.description,
                }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                <span className="text-2xl">📧</span>
                <div>
                  <div className="text-gray-600 text-sm">Email</div>
                  <a
                    href={`mailto:${property.email}`}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {property.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                <span className="text-2xl">📱</span>
                <div>
                  <div className="text-gray-600 text-sm">Phone</div>
                  <a
                    href={`tel:+91${property.phone}`}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    +91 {property.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {property.features && property.features.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Features
              </h2>
              <ul className="grid grid-cols-2 gap-2">
                {property.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <span className="text-green-600">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Link
              to={`/properties/${property._id}/edit`}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Property
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Delete Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;
