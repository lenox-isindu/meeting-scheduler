// script.js
import { db } from './firebase-init.js';
import { collection, addDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function() {
  // Initialize Firebase Auth and keep track of the current user
  const auth = getAuth();
  let currentUser = null;
  auth.onAuthStateChanged(user => {
    currentUser = user;
    if (user) {
      console.log("User logged in:", user.uid);
    } else {
      console.log("No user logged in.");
    }
  });

  // Initialize FullCalendar
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [] // Events will be populated by the realtime listener
  });
  calendar.render();

  // Meeting Modal functionality
  const meetingModal = document.getElementById('meetingModal');
  const openModalBtn = document.getElementById('openModal');
  const closeModalBtn = document.querySelector('.modal .close');
  const meetingForm = document.getElementById('meetingForm');

  openModalBtn.addEventListener('click', () => {
    meetingModal.style.display = 'flex';
  });
  closeModalBtn.addEventListener('click', () => {
    meetingModal.style.display = 'none';
  });
  window.addEventListener('click', (event) => {
    if (event.target === meetingModal) {
      meetingModal.style.display = 'none';
    }
  });

  // Handle meeting form submission: Save meeting to Firestore
  meetingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Ensure the user is authenticated
    if (!currentUser) {
      alert("You must be logged in to create a meeting.");
      return;
    }

    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const attendeesStr = document.getElementById('attendees').value;

    const meetingData = {
      title,
      date,
      time,
      attendees: attendeesStr.split(',').map(email => email.trim()),
      createdAt: serverTimestamp(),
      userId: currentUser.uid
    };

    try {
      await addDoc(collection(db, "meetings"), meetingData);
      alert("Meeting created successfully!");
      meetingForm.reset();
      meetingModal.style.display = 'none';
    } catch (error) {
      console.error("Error adding meeting: ", error);
      alert("Failed to create meeting.");
    }
  });

  // Realtime listener: Update calendar with meetings from Firestore
  onSnapshot(collection(db, "meetings"), (snapshot) => {
    // Remove all existing events
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

  // Video switching functionality
  const videos = [
    "assets/videos/video1.mp4",
    "assets/videos/video2.mp4",
    "assets/videos/video3.mp4"
  ];
  let currentVideo = 0;
  const videoElement = document.getElementById("bg-video");

  function loadVideo(index) {
    videoElement.src = videos[index];
    videoElement.load();
    videoElement.play();
  }

  videoElement.addEventListener("ended", function() {
    currentVideo = (currentVideo + 1) % videos.length;
    loadVideo(currentVideo);
  });
  loadVideo(currentVideo);

  // Typing effect
  const messages = [
    "Take charge and Stay organized with Meeting Scheduler!",
    "Manage your meetings seamlessly with ScheduleWise",
    "Plan ahead and never miss a meeting."
  ];
  let messageIndex = 0;
  let charIndex = 0;
  let typingMessage = document.getElementById("typing-landingpage");

  function typeMessage() {
    if (charIndex < messages[messageIndex].length) {
      typingMessage.textContent += messages[messageIndex].charAt(charIndex);
      charIndex++;
      setTimeout(typeMessage, 100);
    } else {
      setTimeout(deleteMessage, 2000);
    }
  }

  function deleteMessage() {
    if (charIndex > 0) {
      typingMessage.textContent = messages[messageIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(deleteMessage, 50);
    } else {
      messageIndex = (messageIndex + 1) % messages.length;
      setTimeout(typeMessage, 500);
    }
  }
  typeMessage();
});
