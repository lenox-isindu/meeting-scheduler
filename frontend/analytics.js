// analytics.js
import { db } from './firebase-init.js';
import { collection, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', async function() {
    const auth = getAuth();
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            console.log("No authenticated user detected.");
            return;
        }
        console.log("Fetching meetings for user:", user.uid);

        const meetingsRef = collection(db, "meetings");
        const q = query(meetingsRef, where("userId", "==", user.uid), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        let totalMeetings = 0;
        let upcomingMeetings = 0;
        let completedMeetings = 0;
        let meetingCountsByMonth = {};
        let meetingTypes = { "Online": 0, "Physical": 0 };
        let meetingTitlesByMonth = {};

        snapshot.forEach((doc) => {
            totalMeetings++;
            const data = doc.data();
            const meetingDate = new Date(data.date);
            const today = new Date();
            if (meetingDate >= today) {
                upcomingMeetings++;
            } else {
                completedMeetings++;
            }

            const monthYear = `${meetingDate.toLocaleString('default', { month: 'long' })} ${meetingDate.getFullYear()}`;
            meetingCountsByMonth[monthYear] = (meetingCountsByMonth[monthYear] || 0) + 1;
            meetingTitlesByMonth[monthYear] = meetingTitlesByMonth[monthYear] || [];
            meetingTitlesByMonth[monthYear].push(data.title);

            if (data.type === "Online") {
                meetingTypes["Online"]++;
            } else {
                meetingTypes["Physical"]++;
            }
        });

        document.getElementById("total-meetings").textContent = totalMeetings;
        document.getElementById("upcoming-meetings").textContent = upcomingMeetings;
        document.getElementById("completed-meetings").textContent = completedMeetings;

        updateMeetingsChart(Object.values(meetingCountsByMonth), Object.keys(meetingCountsByMonth), meetingTitlesByMonth);
        updateSecondaryChart(Object.values(meetingTypes), Object.keys(meetingTypes));
    });
});

let meetingsChart;
let secondaryChart;

function updateMeetingsChart(data, labels, titlesByMonth) {
    const ctx = document.getElementById('analyticsChart');
    if (!ctx) return;
    if (meetingsChart) meetingsChart.destroy();

    meetingsChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Meetings Per Month',
                data: data,
                backgroundColor: '#4CAF50'
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            const monthLabel = labels[tooltipItem.dataIndex];
                            return titlesByMonth[monthLabel] ? titlesByMonth[monthLabel].join(", ") : "No meetings";
                        }
                    }
                }
            }
        }
    });
}

function updateSecondaryChart(data, labels) {
    const ctx = document.getElementById('secondaryChart');
    if (!ctx) return;
    if (secondaryChart) secondaryChart.destroy();

    secondaryChart = new Chart(ctx.getContext('2d'), {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Meeting Types',
                data: data,
                backgroundColor: ['#FF9800', '#2196F3']
            }]
        },
        options: { responsive: true }
    });
}

// Toggle between charts
document.getElementById('toggleChart').addEventListener('click', function() {
    const analyticsChart = document.getElementById('analyticsChart');
    const secondaryChart = document.getElementById('secondaryChart');
    if (analyticsChart.style.display === 'none') {
        analyticsChart.style.display = 'block';
        secondaryChart.style.display = 'none';
    } else {
        analyticsChart.style.display = 'none';
        secondaryChart.style.display = 'block';
    }
});
