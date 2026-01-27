import React, { useState, useEffect } from "react";
import axios from "axios";
import ContactUsModal from "../components/ContactUsModal";

function ContactUs() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const response = await axios.get("/api/contact");
      setPhone(response.data ? response.data.phone : "");
      setEmail(response.data ? response.data.email : "");
      setAddress(response.data ? response.data.address : "");
    } catch (error) {
      console.error("Error fetching contact:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWebsite = async () => {
    setUpdating(true);
    try {
      await axios.post(process.env.REACT_APP_VERCEL_DEPLOYMENT_URL);
      alert("Website update triggered successfully!");
    } catch (error) {
      console.error("Error updating website:", error);
      alert("Failed to update website.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      {user.role === "admin" && (
        <div className="mb-4 flex gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Edit Contact Us
          </button>
          <button
            onClick={handleUpdateWebsite}
            disabled={updating}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            {updating ? "Updating..." : "Update Website"}
          </button>
        </div>
      )}
      <div className="mb-4">
        <p>
          <strong>Phone:</strong> {phone}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Address:</strong> {address}
        </p>
      </div>
      <ContactUsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchContact}
      />
    </div>
  );
}

export default ContactUs;
