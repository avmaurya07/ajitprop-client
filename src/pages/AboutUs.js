import React, { useState, useEffect } from "react";
import axios from "axios";
import AboutUsModal from "../components/AboutUsModal";

function AboutUs() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await axios.get("/api/about");
      setContent(response.data ? response.data.content : "");
    } catch (error) {
      console.error("Error fetching about:", error);
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
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      {user.role === "admin" && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Edit About Us
        </button>
      )}
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <AboutUsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchAbout}
      />
    </div>
  );
}

export default AboutUs;
