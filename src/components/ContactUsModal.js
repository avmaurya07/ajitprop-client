import React, { useState, useEffect } from "react";
import axios from "axios";

function ContactUsModal({ isOpen, onClose, onSave }) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchContact();
    }
  }, [isOpen]);

  const fetchContact = async () => {
    try {
      const response = await axios.get("/api/contact");
      setPhone(response.data ? response.data.phone : "");
      setEmail(response.data ? response.data.email : "");
      setAddress(response.data ? response.data.address : "");
    } catch (error) {
      console.error("Error fetching contact:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/contact",
        { phone, email, address },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      onSave && onSave();
      onClose();
    } catch (error) {
      console.error("Error saving contact:", error);
    } finally {
      setLoading(false);
    }
  };

  const template = `<h2>Contact Us</h2><p>We would love to hear from you. Whether you have questions about a property, need expert guidance, or want to discuss investment opportunities, our team at Ajit Properties is always ready to assist you.</p><h3>Get in Touch</h3><p>Please feel free to reach out to us using the contact details below or by filling out the inquiry form. Our representatives will get back to you as soon as possible.</p><h3>Contact Information</h3><ul><li><strong>Phone:</strong> {{phone}}</li><li><strong>Email:</strong> {{email}}</li><li><strong>Office Address:</strong> {{address}}</li><li><strong>Working Hours:</strong> Monday – Saturday, 9:00 AM – 7:00 PM</li></ul><h3>Why Contact Ajit Properties</h3><ul><li>Professional property consultation</li><li>Verified and trusted listings</li><li>Personalized property recommendations</li><li>Transparent and hassle-free process</li></ul><h3>We’re Here to Help</h3><p>Your satisfaction is our priority. Contact us today and let Ajit Properties help you find the right property that matches your needs and budget.</p>`;

  const previewContent = template
    .replace("{{phone}}", phone)
    .replace("{{email}}", email)
    .replace("{{address}}", address);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Contact Us</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter phone number"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter email address"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter office address"
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactUsModal;
