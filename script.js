document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const meetingModal = document.getElementById('meetingModal');
    const openModalBtn = document.getElementById('openModal');
    const closeModalBtn = document.querySelector('.close');
    const meetingForm = document.getElementById('meetingForm');
  
    let meetings = []; // Array to store meetings
  
    // Initialize FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: meetings, // Display meetings as events
      dateClick: function (info) {
        // Open modal when a date is clicked
        document.getElementById('date').value = info.dateStr;
        meetingModal.style.display = 'flex';
      },
      eventClick: function (info) {
        // Display meeting details when an event is clicked
        alert(`Meeting: ${info.event.title}\nDate: ${info.event.start}\nAttendees: ${info.event.extendedProps.attendees}`);
      }
    });
  
    calendar.render();
  
    // Open modal
    openModalBtn.addEventListener('click', () => {
      meetingModal.style.display = 'flex';
    });
  
    // Close modal
    closeModalBtn.addEventListener('click', () => {
      meetingModal.style.display = 'none';
    });
  
    // Handle form submission
    meetingForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const title = document.getElementById('title').value;
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;
      const attendees = document.getElementById('attendees').value;
  
      const meeting = {
        title: title,
        start: `${date}T${time}`,
        attendees: attendees,
        backgroundColor: '#007bff',
        borderColor: '#007bff'
      };
  
      // Add meeting to the calendar
      calendar.addEvent(meeting);
      meetings.push(meeting);
  
      // Clear form and close modal
      meetingForm.reset();
      meetingModal.style.display = 'none';
    });
  });
  document.addEventListener("DOMContentLoaded", function () {
    // Typing effect
    const messages = ["Schedule your meetings with ease.", "Stay organized with Meeting Scheduler!", "Plan ahead and never miss a meeting."];
    let messageIndex = 0;
    let charIndex = 0;
    let typingMessage = document.getElementById("typing-message");

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


document.addEventListener("DOMContentLoaded", function() {
  // Array of video sources
  const videos = [
    "assets/videos/video1.mp4",
    "assets/videos/video2.mp4",
    "assets/videos/video3.mp4"
  ];
  
  let currentVideo = 0;
  const videoElement = document.getElementById("bg-video");

  // Function to load a video by index
  function loadVideo(index) {
    videoElement.src = videos[index];
    videoElement.load();
    videoElement.play();
  }
  
  // When the current video ends, load the next one
  videoElement.addEventListener("ended", function() {
    currentVideo = (currentVideo + 1) % videos.length;
    loadVideo(currentVideo);
  });
  
  // Start playing the first video
  loadVideo(currentVideo);
});

  document.addEventListener("DOMContentLoaded", function () {
    // Typing effect
    const messages = ["Take charge and Stay organized with ScheduleWise!", "Manage your meetings seamlessly with ScheduleWise", "Plan ahead and never miss a meeting."];
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
