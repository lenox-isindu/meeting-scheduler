import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import * as emailjs from "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";


// Firebase configuration (Replace with your Firebase config)
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
const db = getFirestore(app);
const auth = getAuth();

document.addEventListener("DOMContentLoaded", function () {
  let currentUser = null;
  
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
      console.log("User logged in:", user.uid);
    } else {
      console.log("No user logged in.");
    }
  });

  // Initialize FullCalendar
  const calendarEl = document.getElementById("calendar");
  if (calendarEl) {
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay"
      },
      events: []
    });
    calendar.render();

    // Real-time Firestore updates
    onSnapshot(collection(db, "meetings"), (snapshot) => {
      calendar.getEvents().forEach(event => event.remove());
      snapshot.forEach((doc) => {
        const meeting = doc.data();
        const eventData = {
          title: meeting.title,
          start: `${meeting.date}T${meeting.time}`,
          extendedProps: { attendees: meeting.attendees },
          backgroundColor: '#007bff',
          borderColor: '#007bff'
        };
        calendar.addEvent(eventData);
      });
    });
  } else {
    console.error("Calendar element not found!");
  }

  // Modal functionality
  const meetingModal = document.getElementById("meetingModal");
  const openModalBtn = document.getElementById("openModal");
  const closeModalBtn = document.querySelector(".modal .close");
  const meetingForm = document.getElementById("meetingForm");

  openModalBtn.addEventListener("click", () => {
    meetingModal.style.display = "flex";
  });
  closeModalBtn.addEventListener("click", () => {
    meetingModal.style.display = "none";
  });
  window.addEventListener("click", (event) => {
    if (event.target === meetingModal) {
      meetingModal.style.display = "none";
    }
  });

  // Handle meeting form submission
  meetingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("You must be logged in to create a meeting.");
      return;
    }

    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const attendeesStr = document.getElementById("attendees").value;

    const meetingData = {
      title,
      date,
      time,
      attendees: attendeesStr.split(",").map(email => email.trim()),
      createdAt: serverTimestamp(),
      userId: currentUser.uid
    };

    try {
      await addDoc(collection(db, "meetings"), meetingData);
      alert("Meeting created successfully!");

      // Send email notification using EmailJS
      window.emailjs.send("service_nuijfdx", "template_o2slzne", {
        to_email: attendeesStr,
        subject: `New Meeting: ${title}`,
        message: `You have been invited to a meeting.\n\nTitle: ${title}\nDate: ${date}\nTime: ${time}\n\nOrganizer: ${currentUser.email}`
      }, "ngM8Jp0R-SlApxBzD")
      .then(response => console.log("Email sent successfully:", response))
      .catch(error => console.error("Error sending email:", error));

      meetingForm.reset();
      meetingModal.style.display = "none";
    } catch (error) {
      console.error("Error adding meeting: ", error);
      alert("Failed to create meeting.");
    }
  });
});
