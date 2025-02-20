// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Your Firebase configuration (replace with your actual config)

    const firebaseConfig = {
        apiKey: "AIzaSyA4TngtBlGrh-9EQaQE-cdrz-KTjV0NNQk",
        authDomain: "meeting-scheduler-6cae7.firebaseapp.com",
        projectId: "meeting-scheduler-6cae7",
        storageBucket: "meeting-scheduler-6cae7.firebasestorage.app",
        messagingSenderId: "684233760033",
        appId: "1:684233760033:web:2e7b8a40cfb64094467260"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
