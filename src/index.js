import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";
import { setupAxiosInterceptor } from "./utils/axiosInterceptor";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// Setup global axios interceptor for handling authentication errors
setupAxiosInterceptor();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
