// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// Firebase configuration
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
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  // Handle Sign-Up if the sign-up form exists
  const signupForm = document.getElementById("sign-up-form");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = signupForm.querySelector("#email").value;
      const password = signupForm.querySelector("#password").value;
      const confirmPassword = signupForm.querySelector("#confirm-password").value;

      // Check if passwords match
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("User signed up:", userCredential.user);
          window.location.href = "login.html"; // Redirect to login page
        })
        .catch((error) => {
          console.error("Error signing up:", error.message);
          alert("Error signing up: " + error.message);
        });
    });
  }

  // Handle Login if the login form exists
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm.querySelector("#login-email").value;
      const password = loginForm.querySelector("#login-password").value;
      
      if (!email || !password) {
        alert("Please fill in both email and password.");
        return;
      }
      
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("Successfully logged in:", userCredential.user);
          alert("Logged in successfully!");
          window.location.href = "dashboard.html"; // Redirect to dashboard page
        })
        .catch((error) => {
          console.error("Error logging in:", error.message);
          alert("Login failed: " + error.message);
        });
    });
  }
});


import { signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  // Handle Logout if the logout button exists
  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          console.log("User logged out successfully");
          alert("Logged out successfully!");
          window.location.href = "landingpage.html"; // Redirect to landing page
        })
        .catch((error) => {
          console.error("Error logging out:", error.message);
          alert("Logout failed: " + error.message);
        });
    });
  }
});



