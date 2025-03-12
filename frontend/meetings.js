// my-meetings.js
import { db } from './firebase-init.js';
import { collection, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', async function () {
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

        const meetingList = document.getElementById("meeting-list");
        if (!meetingList) return;

        meetingList.innerHTML = "";

        if (snapshot.empty) {
            meetingList.innerHTML = "<li>No scheduled meetings found.</li>";
            return;
        }

        snapshot.forEach((doc) => {
            const data = doc.data();
            const meetingItem = document.createElement("li");
            meetingItem.classList.add("meeting-item");
            meetingItem.textContent = `${data.title} - ${data.date} at ${data.time}`;

            // Open modal with meeting details on click
            meetingItem.addEventListener("click", () => {
                openModal(data.title, data.description, data.date, data.time, data.type);
            });

            meetingList.appendChild(meetingItem);
        });
    });
});

// Open Modal Function
function openModal(title, description, date, time, type) {
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").innerHTML = `
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Description:</strong> ${description}</p>
    `;

    document.querySelector(".overlay").style.display = "block";
    document.querySelector(".modal").style.display = "block";
}

// Close Modal
document.querySelector(".close-btn").addEventListener("click", () => {
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".modal").style.display = "none";
});
