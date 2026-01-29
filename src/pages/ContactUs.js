import React, { useState, useEffect } from "react";
import axios from "axios";
import ContactUsModal from "../components/ContactUsModal";

function ContactUs() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    whatsapp: "",
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [updating, setUpdating] = useState(false);
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
      setSocialLinks(
        response.data?.socialLinks || {
          facebook: "",
          twitter: "",
          instagram: "",
          linkedin: "",
          youtube: "",
          whatsapp: "",
        },
      );
    } catch (error) {
      console.error("Error fetching contact:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleUpdateWebsite = async () => {
  //   setUpdating(true);
  //   try {
  //     await axios.post(process.env.REACT_APP_VERCEL_DEPLOYMENT_URL);
  //     alert("Website update triggered successfully!");
  //   } catch (error) {
  //     console.error("Error updating website:", error);
  //     alert("Failed to update website.");
  //   } finally {
  //     setUpdating(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Contact Management
          </h1>
          <p className="text-gray-500 mt-1 text-lg">
            Manage your business contact details and social media presence.
          </p>
        </div>
        {user.role === "admin" && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Edit Contact Details
            </button>
            {/* <button
              onClick={handleUpdateWebsite}
              disabled={updating}
              className={`px-6 py-2.5 ${updating ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"} text-white font-semibold rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 active:scale-95`}
            >
              {updating ? "Publishing..." : "Publish Website"}
            </button> */}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Card */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-100 pb-4">
            General Info
          </h2>
          <div className="space-y-6">
            <div className="group">
              <label className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
                Phone
              </label>
              <p className="text-lg text-gray-700 font-medium mt-1">
                {phone || "Not provided"}
              </p>
            </div>
            <div className="group">
              <label className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
                Email
              </label>
              <p className="text-lg text-gray-700 font-medium mt-1 break-all">
                {email || "Not provided"}
              </p>
            </div>
            <div className="group">
              <label className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
                Address
              </label>
              <p className="text-lg text-gray-700 font-medium mt-1">
                {address || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Social Links Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6">
            Social Networks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(socialLinks).map(([platform, link]) => (
              <div
                key={platform}
                className="flex flex-col p-4 rounded-xl border border-gray-50 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-100 transition-all group"
              >
                <span className="capitalize text-xs font-bold text-gray-400 group-hover:text-indigo-400 transition-colors uppercase tracking-widest">
                  {platform}
                </span>
                <div className="mt-2 truncate">
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 font-medium hover:text-indigo-600 truncate block"
                    >
                      {link.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic text-sm">
                      Not configured
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
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
