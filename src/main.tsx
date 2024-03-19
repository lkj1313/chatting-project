import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2whEs3DNQ9jyKa-ysTeQPZEgud3AEp6o",
  authDomain: "chatting-project-5cdb2.firebaseapp.com",
  projectId: "chatting-project-5cdb2",
  storageBucket: "chatting-project-5cdb2.appspot.com",
  messagingSenderId: "331539780409",
  appId: "1:331539780409:web:7bb65e37ee2111068e0ee8",
  measurementId: "G-BG6G8XDJZB",
};
// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firestore를 사용할 준비가 되었습니다.
const firestore = getFirestore(app);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default firestore;
