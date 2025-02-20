// dashboard.js
import { db } from './firebase-init.js';
import { collection, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function() {
  // Sidebar toggle functionality
  const toggleBtn = document.getElementById('sidebar-toggle');
  const dashboardLayout = document.querySelector('.dashboard-layout');
  toggleBtn.addEventListener('click', function() {
    dashboardLayout.classList.toggle('sidebar-hidden');
  });

  // Listen for auth state changes and update dashboard content accordingly
  const auth = getAuth();
  auth.onAuthStateChanged((user) => {
    if (user) {
      const meetingList = document.getElementById('meeting-list');
      const activityList = document.getElementById('activity-list');
      const notificationList = document.getElementById('notification-list');

      // Query meetings for the current user, ordered by createdAt descending
      const q = query(
        collection(db, "meetings"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      
      onSnapshot(q, (snapshot) => {
        // Clear current lists
        meetingList.innerHTML = "";
        activityList.innerHTML = "";
        notificationList.innerHTML = "";
        
        if (snapshot.empty) {
          meetingList.innerHTML = "<li>No upcoming meetings</li>";
          activityList.innerHTML = "<li>No recent activity</li>";
          notificationList.innerHTML = "<li>No new notifications</li>";
        } else {
          snapshot.forEach((doc) => {
            const meeting = doc.data();
            const meetingItemText = `${meeting.title} - ${meeting.date} at ${meeting.time}`;
            // Upcoming Meetings
            const meetingItem = document.createElement('li');
            meetingItem.textContent = meetingItemText;
            meetingList.appendChild(meetingItem);
            // Recent Activity
            const activityItem = document.createElement('li');
            activityItem.textContent = `Created meeting: ${meetingItemText}`;
            activityList.appendChild(activityItem);
            // Notifications
            const notificationItem = document.createElement('li');
            notificationItem.textContent = `New meeting scheduled: ${meetingItemText}`;
            notificationList.appendChild(notificationItem);
          });
        }
      });
    } else {
      console.log("No authenticated user detected.");
      // Optionally, redirect to login page
    }
  });
});

