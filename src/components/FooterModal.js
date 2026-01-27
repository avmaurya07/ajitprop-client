import React, { useState, useEffect } from "react";
import axios from "axios";
import ImageUploader from "./ImageUploader";

function FooterModal({ isOpen, onClose, onSave }) {
  const frontendUrl =
    process.env.REACT_APP_FRONTEND_URL || "http://localhost:3001";
  const [footer, setFooter] = useState({
    logo: "",
    description: "",
    contactInfo: {
      phone: "",
      email: "",
      address: "",
    },
    newsletter: {
      title: "",
      placeholder: "",
      buttonText: "",
    },
    quickLinks: [
      {
        title: "",
        links: [{ text: "", url: "" }],
      },
    ],
    copyright: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchFooter();
    }
  }, [isOpen]);

  const fetchFooter = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/footer");
      setFooter(response.data);
    } catch (error) {
      console.error("Error fetching footer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/footer", footer, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving footer:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset to default values?")) {
      setSaving(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post("/api/footer/reset", null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFooter(response.data);
        onSave();
      } catch (error) {
        console.error("Error resetting footer:", error);
      } finally {
        setSaving(false);
      }
    }
  };

  const updateContactInfo = (field, value) => {
    setFooter((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
  };

  const updateNewsletter = (field, value) => {
    setFooter((prev) => ({
      ...prev,
      newsletter: {
        ...prev.newsletter,
        [field]: value,
      },
    }));
  };

  const updateQuickLink = (linkIndex, field, value) => {
    setFooter((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.map((link, index) =>
        index === linkIndex ? { ...link, [field]: value } : link,
      ),
    }));
  };

  const updateQuickLinkItem = (linkIndex, itemIndex, field, value) => {
    setFooter((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.map((link, index) =>
        index === linkIndex
          ? {
              ...link,
              links: link.links.map((item, i) =>
                i === itemIndex ? { ...item, [field]: value } : item,
              ),
            }
          : link,
      ),
    }));
  };

  const addQuickLinkItem = (linkIndex) => {
    setFooter((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.map((link, index) =>
        index === linkIndex
          ? { ...link, links: [...link.links, { text: "", url: "" }] }
          : link,
      ),
    }));
  };

  const removeQuickLinkItem = (linkIndex, itemIndex) => {
    setFooter((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.map((link, index) =>
        index === linkIndex
          ? { ...link, links: link.links.filter((_, i) => i !== itemIndex) }
          : link,
      ),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Footer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-6">
            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo
              </label>
              {footer.logo && (
                <div className="mb-2">
                  <img
                    src={
                      footer.logo.includes("http")
                        ? footer.logo
                        : `${frontendUrl}/${footer.logo}`
                    }
                    alt="Logo"
                    className="w-20 h-10 object-contain"
                  />
                </div>
              )}
              <ImageUploader
                onUploadSuccess={(urls) =>
                  setFooter((prev) => ({ ...prev, logo: urls[0] }))
                }
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={footer.description}
                onChange={(e) =>
                  setFooter((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Footer description text"
              />
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={footer.contactInfo.phone}
                    onChange={(e) => updateContactInfo("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={footer.contactInfo.email}
                    onChange={(e) => updateContactInfo("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={footer.contactInfo.address}
                    onChange={(e) =>
                      updateContactInfo("address", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Newsletter Section
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={footer.newsletter.title}
                    onChange={(e) => updateNewsletter("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Placeholder
                  </label>
                  <input
                    type="text"
                    value={footer.newsletter.placeholder}
                    onChange={(e) =>
                      updateNewsletter("placeholder", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={footer.newsletter.buttonText}
                    onChange={(e) =>
                      updateNewsletter("buttonText", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Links
              </h3>
              {footer.quickLinks.map((linkGroup, linkIndex) => (
                <div
                  key={linkIndex}
                  className="mb-6 p-4 border border-gray-200 rounded-md"
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={linkGroup.title}
                      onChange={(e) =>
                        updateQuickLink(linkIndex, "title", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Links
                    </label>
                    {linkGroup.links.map((link, itemIndex) => (
                      <div key={itemIndex} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={link.text}
                          onChange={(e) =>
                            updateQuickLinkItem(
                              linkIndex,
                              itemIndex,
                              "text",
                              e.target.value,
                            )
                          }
                          placeholder="Link text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) =>
                            updateQuickLinkItem(
                              linkIndex,
                              itemIndex,
                              "url",
                              e.target.value,
                            )
                          }
                          placeholder="URL"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() =>
                            removeQuickLinkItem(linkIndex, itemIndex)
                          }
                          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addQuickLinkItem(linkIndex)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Add Link
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Copyright */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Copyright Text
              </label>
              <input
                type="text"
                value={footer.copyright}
                onChange={(e) =>
                  setFooter((prev) => ({ ...prev, copyright: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Copyright text"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            Reset to Default
          </button>
          <div className="space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterModal;
