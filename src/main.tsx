import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC2whEs3DNQ9jyKa-ysTeQPZEgud3AEp6o",
  authDomain: "chatting-project-5cdb2.firebaseapp.com",
  projectId: "chatting-project-5cdb2",
  storageBucket: "chatting-project-5cdb2.appspot.com",
  messagingSenderId: "331539780409",
  appId: "1:331539780409:web:59c018ade6f7b1378e0ee8",
  measurementId: "G-0PP0VEK11Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
