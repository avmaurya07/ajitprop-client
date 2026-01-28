import React, { useState, useEffect } from "react";
import axios from "axios";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data);
    } catch (err) {
      setError("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(messages.filter((msg) => msg._id !== id));
    } catch (err) {
      setError("Failed to delete message");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Messages</h1>
        <p className="text-gray-600 mt-2">
          View and manage messages sent by users through the contact form.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No messages found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map((message) => (
                  <tr key={message._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {message.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {message.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {message.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {message.category}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm text-gray-500 max-w-xs ${message.message.length > 50 ? "cursor-pointer hover:text-blue-600 truncate" : ""}`}
                      title={
                        message.message.length > 50
                          ? "Click to view full message"
                          : message.message
                      }
                      onClick={
                        message.message.length > 50
                          ? () => setSelectedMessage(message)
                          : undefined
                      }
                    >
                      {message.message.length > 50
                        ? `${message.message.substring(0, 50)}...`
                        : message.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => deleteMessage(message._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Full Message from {selectedMessage.name}
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {selectedMessage.message}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedMessage(null)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
