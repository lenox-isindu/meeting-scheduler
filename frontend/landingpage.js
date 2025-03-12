
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
      const messages = ["Take charge and Stay organized with Meeting Scheduler!", "Manage your meetings seamlessly with ScheduleWise", "Plan ahead and never miss a meeting."];
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
  