// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeoF_mBC-LZP6Co8nuYUWifp2aar3HpSo",
  authDomain: "sb-projects-24-25.firebaseapp.com",
  databaseURL: "https://sb-projects-24-25-default-rtdb.firebaseio.com",
  projectId: "sb-projects-24-25",
  storageBucket: "sb-projects-24-25.firebasestorage.app",
  messagingSenderId: "280817570535",
  appId: "1:280817570535:web:e2638cc48daa0126d60842",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// getting database
export const db = getDatabase(app);
