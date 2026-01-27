import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Properties() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/properties`,
      );
      setProperties(response.data);
    } catch (err) {
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(search.toLowerCase()) ||
      property.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !statusFilter || property.status === statusFilter;
    const matchesType = !typeFilter || property.type === typeFilter;

    const matchesMinPrice = !minPrice || property.price >= Number(minPrice);
    const matchesMaxPrice = !maxPrice || property.price <= Number(maxPrice);

    const matchesBeds = !beds || property.bedrooms >= Number(beds);

    const matchesBaths = !baths || property.bathrooms >= Number(baths);

    const matchesMinArea = !minArea || property.area >= Number(minArea);

    const matchesMaxArea = !maxArea || property.area <= Number(maxArea);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesType &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesBeds &&
      matchesBaths &&
      matchesMinArea &&
      matchesMaxArea
    );
  });

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    typeFilter,
    minPrice,
    maxPrice,
    beds,
    baths,
    minArea,
    maxArea,
  ]);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleDelete = async (id) => {
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
        // Refresh the properties list after deletion
        fetchProperties();
      } catch (err) {
        setError("Failed to delete property");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-gray-500">
        Loading properties...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Properties</h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {properties.length > 0 ? startIndex + 1 : 0} –{" "}
            {Math.min(endIndex, properties.length)} of{" "}
            {filteredProperties.length} properties
          </p>
        </div>
        <Link
          to="/properties/add"
          className="px-5 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-800 transition"
        >
          + Add Property
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 text-sm border rounded-md"
          />

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border rounded-md"
          >
            <option value="">Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>

          {/* Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-sm border rounded-md capitalize"
          >
            <option value="">Type</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="plot">Plot</option>
          </select>

          {/* Beds */}
          <input
            type="number"
            min="0"
            placeholder="Beds ≥"
            value={beds}
            onChange={(e) => setBeds(e.target.value)}
            className="px-3 py-2 text-sm border rounded-md"
          />

          {/* Baths */}
          <input
            type="number"
            min="0"
            placeholder="Baths ≥"
            value={baths}
            onChange={(e) => setBaths(e.target.value)}
            className="px-3 py-2 text-sm border rounded-md"
          />

          {/* Min Area */}
          <input
            type="number"
            min="0"
            placeholder="Min sqft"
            value={minArea}
            onChange={(e) => setMinArea(e.target.value)}
            className="px-3 py-2 text-sm border rounded-md"
          />

          {/* Max Area */}
          <input
            type="number"
            min="0"
            placeholder="Max sqft"
            value={maxArea}
            onChange={(e) => setMaxArea(e.target.value)}
            className="px-3 py-2 text-sm border rounded-md"
          />

          {/* Clear */}
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("");
              setTypeFilter("");
              setMinPrice("");
              setMaxPrice("");
              setBeds("");
              setBaths("");
              setMinArea("");
              setMaxArea("");
            }}
            className="px-3 py-2 text-sm border rounded-md hover:bg-gray-100"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Empty State */}
      {properties.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-sm text-gray-500">
          No properties found.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "S.No",
                    "Property",
                    "Location",
                    "Type",
                    "Price",
                    "Details",
                    "Status",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-600"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {currentProperties.map((property, index) => (
                  <tr
                    key={property._id}
                    className="hover:bg-gray-50 transition"
                  >
                    {/* S.No */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    {/* Property */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-900">
                          {property.name}
                        </span>
                        {property.featured && (
                          <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-md">
                            Featured
                          </span>
                        )}
                        {property.available === false && (
                          <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-md">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {property.location}
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md capitalize">
                        {property.type}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {property.price > 0
                        ? `₹${property.price.toLocaleString()}`
                        : "On Request"}
                    </td>

                    {/* Details */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {property.bedrooms} Bed · {property.bathrooms} Bath ·{" "}
                      {property.area} sqft
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs rounded-md font-medium ${
                          property.status === "available"
                            ? "bg-green-100 text-green-700"
                            : property.status === "sold"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {property.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-center">
                        <Link
                          to={`/properties/${property._id}`}
                          className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                          title="View"
                        >
                          👁
                        </Link>
                        <Link
                          to={`/properties/${property._id}/edit`}
                          className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-green-600"
                          title="Edit"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(property._id)}
                          className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-green-600"
                          title="Delete"
                        >
                          ❌
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 border-t text-sm text-gray-600">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-md disabled:opacity-40"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i + 1)}
                    className={`w-9 h-9 rounded-md border ${
                      currentPage === i + 1
                        ? "bg-gray-900 text-white border-gray-900"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-md disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Properties;
