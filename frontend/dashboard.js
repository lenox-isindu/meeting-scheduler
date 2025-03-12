// dashboard.js
import { db } from './firebase-init.js';
import { collection, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Initialize chart
let meetingsChart;
function updateMeetingsChart(meetingCounts, labels) {
    const ctx = document.getElementById('analyticsChart');
    if (!ctx) return; // Ensure canvas exists
    if (meetingsChart) {
        meetingsChart.destroy(); // Destroy existing chart before re-rendering
    }
    meetingsChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Meetings',
                data: meetingCounts,
                backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'],
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle functionality
    const toggleBtn = document.getElementById('sidebar-toggle');
    const dashboardLayout = document.querySelector('.dashboard-layout');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            dashboardLayout.classList.toggle('sidebar-hidden');
        });
    }

    // Modal elements
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-btn');

    function openModal(title, content) {
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modal.style.display = 'flex';
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Click to expand meeting analytics card
    const analyticsCard = document.querySelector('.dashboard-card h3');
    if (analyticsCard) {
        analyticsCard.addEventListener('click', function(event) {
            event.preventDefault();
            let details = '';
            const meetings = document.querySelectorAll('#meeting-list li');
            
            if (meetings.length === 0) {
                details = '<p>No scheduled meetings available.</p>';
            } else {
                meetings.forEach(meeting => {
                    details += `<p>${meeting.textContent}</p>`;
                });
            }
            
            openModal('Meeting Analytics', details);
        });
    }

    // Click to expand other cards (Notifications, Recent Activity)
    document.querySelectorAll('.dashboard-card').forEach(card => {
        card.addEventListener('click', function() {
            let content = '';
            if (card.id === 'notification-card') {
                const notifications = document.querySelectorAll('#notification-list li');
                notifications.forEach(n => content += `<p>${n.textContent}</p>`);
                openModal('Notifications', content || '<p>No new notifications.</p>');
            } else if (card.id === 'activity-card') {
                const activities = document.querySelectorAll('#activity-list li');
                activities.forEach(a => content += `<p>${a.textContent}</p>`);
                openModal('Recent Activity', content || '<p>No recent activity.</p>');
            }
        });
    });

    // Time filter buttons
    ['filter-today', 'filter-week', 'filter-month'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', () => fetchMeetings(id.replace('filter-', '')));
    });

    function fetchMeetings(filter) {
        const auth = getAuth();
        auth.onAuthStateChanged((user) => {
            if (!user) {
                console.log("No authenticated user detected.");
                return;
            }
            console.log("Fetching meetings for user:", user.uid);

            const meetingList = document.getElementById('meeting-list');
            const activityList = document.getElementById('activity-list');
            const notificationList = document.getElementById('notification-list');
            if (!meetingList || !activityList || !notificationList) return;
            
            const now = new Date();
            let startDate;
            if (filter === 'today') {
                startDate = new Date(now.setHours(0, 0, 0, 0));
            } else if (filter === 'week') {
                startDate = new Date(now.setDate(now.getDate() - now.getDay()));
            } else if (filter === 'month') {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            }
            
            const q = query(
                collection(db, "meetings"),
                where("userId", "==", user.uid),
                where("createdAt", ">=", startDate),
                orderBy("createdAt", "desc")
            );
            
            onSnapshot(q, (snapshot) => {
                console.log("Meetings fetched:", snapshot.docs.map(doc => doc.data()));
                
                // Clear current lists
                meetingList.innerHTML = "";
                activityList.innerHTML = "";
                notificationList.innerHTML = "";
                
                let meetingCount = 0;
                if (snapshot.empty) {
                    meetingList.innerHTML = "<li>No upcoming meetings</li>";
                    activityList.innerHTML = "<li>No recent activity</li>";
                    notificationList.innerHTML = "<li>No new notifications</li>";
                } else {
                    snapshot.forEach((doc) => {
                        const meeting = doc.data();
                        meetingCount++;
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
                updateMeetingsChart([meetingCount], [filter]);
            });
        });
    }
    
    // Fetch today's meetings by default
    fetchMeetings('today');
});
