import React, { useState, useEffect } from "react";
import axios from "axios";
import ContactUsModal from "../components/ContactUsModal";

function ContactUs() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const response = await axios.get("/api/contact");
      setContent(response.data ? response.data.content : "");
    } catch (error) {
      console.error("Error fetching contact:", error);
    } finally {
      setLoading(false);
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Edit Contact Us
        </button>
      )}
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <ContactUsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchContact}
      />
    </div>
  );
}

export default ContactUs;
