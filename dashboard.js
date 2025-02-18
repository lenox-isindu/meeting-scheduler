document.addEventListener("DOMContentLoaded", function () {
    // Sample Data (You can replace this with API calls)
    let meetings = [
        { title: "Team Sync", date: "2025-02-18", time: "10:00 AM" },
        { title: "Project Review", date: "2025-02-19", time: "02:00 PM" }
    ];
    let notifications = ["Meeting rescheduled", "New comment on your task"];
    let activityLog = ["Logged in", "Updated profile", "Created a meeting"];

    // Populate Upcoming Meetings
    function loadMeetings() {
        let meetingList = document.getElementById("meeting-list");
        meetingList.innerHTML = "";
        if (meetings.length === 0) {
            meetingList.innerHTML = "<li>No upcoming meetings</li>";
        } else {
            meetings.forEach(meeting => {
                let li = document.createElement("li");
                li.textContent = `${meeting.title} - ${meeting.date} at ${meeting.time}`;
                meetingList.appendChild(li);
            });
        }
    }

    // Populate Notifications
    function loadNotifications() {
        let notificationList = document.getElementById("notification-list");
        notificationList.innerHTML = "";
        if (notifications.length === 0) {
            notificationList.innerHTML = "<li>No new notifications</li>";
        } else {
            notifications.forEach(note => {
                let li = document.createElement("li");
                li.textContent = note;
                notificationList.appendChild(li);
            });
        }
    }

    // Populate Recent Activity
    function loadActivity() {
        let activityList = document.getElementById("activity-list");
        activityList.innerHTML = "";
        if (activityLog.length === 0) {
            activityList.innerHTML = "<li>No recent activity</li>";
        } else {
            activityLog.forEach(act => {
                let li = document.createElement("li");
                li.textContent = act;
                activityList.appendChild(li);
            });
        }
    }

    // Open Create Meeting Modal (Mockup)
    document.getElementById("create-meeting").addEventListener("click", function () {
        let meetingTitle = prompt("Enter Meeting Title:");
        let meetingDate = prompt("Enter Meeting Date (YYYY-MM-DD):");
        let meetingTime = prompt("Enter Meeting Time (HH:MM AM/PM):");

        if (meetingTitle && meetingDate && meetingTime) {
            meetings.push({ title: meetingTitle, date: meetingDate, time: meetingTime });
            activityLog.push(`Created meeting: ${meetingTitle}`);
            loadMeetings();
            loadActivity();
            alert("Meeting Created!");
        }
    });

    // Initialize Dashboard
    loadMeetings();
    loadNotifications();
    loadActivity();
});
