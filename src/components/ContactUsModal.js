import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";

function ContactUsModal({ isOpen, onClose, onSave }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchContact();
    }
  }, [isOpen]);

  const fetchContact = async () => {
    try {
      const response = await axios.get("/api/contact");
      setContent(response.data ? response.data.content : "");
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
        { content },
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Contact Us</h2>
        <CKEditor
          editor={ClassicEditor}
          data={content}
          config={{
            ckfinder: {
              uploadUrl: `${process.env.REACT_APP_API_URL}/api/upload/ckeditor`,
            },
            height: "500px",
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            setContent(data);
          }}
        />
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
