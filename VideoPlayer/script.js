const init = () => {
  const videoPlayer = document.getElementById("video");

  const currentTimeDisplay = document.getElementById("currentTime");
  const updateCurrentTime = () => {
    const currentTime = Math.floor(videoPlayer.currentTime);
    const duration = Math.floor(videoPlayer.duration);
    currentTimeDisplay.textContent = `${secondsToTimeString(currentTime)} / ${secondsToTimeString(duration)}`;
  };

  const videoLoadButton = document.getElementById("loadVideo");
  videoLoadButton.addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "video/*";
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const blob = new Blob([e.target.result], {type: file.type});
        const url = URL.createObjectURL(blob);
        videoPlayer.src = url;
        document.getElementById("file-select-view").style.display = "none";
        document.getElementById("video-view").style.display = "flex";
      };
      reader.readAsArrayBuffer(file);
    });
    fileInput.click();
  });

  const playPoseButton = document.getElementById("playPause");
  playPoseButton.addEventListener("click", () => {
    if (videoPlayer.paused) {
      const startTime = parseFloat(startTimeInput.value);
      const endTime = parseFloat(endTimeInput.value);
      const currentTime = videoPlayer.currentTime;
      if (currentTime < startTime) {
        videoPlayer.currentTime = startTime;
      } else if (currentTime >= endTime) {
        videoPlayer.currentTime = startTime;
      }
      videoPlayer.play();
      playPoseButton.textContent = "Pause";
    } else {
      videoPlayer.pause();
      playPoseButton.textContent = "Play";
    }
  });

  const startTimeInput = document.getElementById("startTime");
  startTimeInput.addEventListener("blur", () => {
    let startTime = parseFloat(startTimeInput.value);
    const endTime = parseFloat(endTimeInput.value);
    if (startTime >= endTime) {
      startTimeInput.value = endTime - 0.1;
      startTime = parseFloat(startTimeInput.value);
    }
    const currentTime = videoPlayer.currentTime;
    if (currentTime < startTime) {
      videoPlayer.currentTime = startTime;
    }
  });

  const setStartTimeButton = document.getElementById("setStartTime");
  setStartTimeButton.addEventListener("click", () => {
    const currentTime = videoPlayer.currentTime.toFixed(3);
    startTimeInput.value = currentTime
  });

  const endTimeInput = document.getElementById("endTime");
  endTimeInput.addEventListener("blur", () => {
    const startTime = parseFloat(startTimeInput.value);
    let endTime = parseFloat(endTimeInput.value);
    if (endTime <= startTime) {
      endTimeInput.value = startTime + 0.1;
      endTime = parseFloat(endTimeInput.value);
    }
    if (endTime <= videoPlayer.currentTime) {
      videoPlayer.currentTime = endTime;
    }
  });

  const setEndTimeButton = document.getElementById("setEndTime");
  setEndTimeButton.addEventListener("click", () => {
    const currentTime = videoPlayer.currentTime.toFixed(3);
    endTimeInput.value = currentTime
  });

  const speedInput = document.getElementById("speed");
    speedInput.addEventListener("input", () => {
    const speed = parseFloat(speedInput.value);
    videoPlayer.playbackRate = speed;
  });

  videoPlayer.addEventListener("loadedmetadata", () => {
    const duration = videoPlayer.duration.toFixed(3);
    startTimeInput.min = 0;
    startTimeInput.max = duration;
    startTimeInput.value = 0;
    endTimeInput.min = 0;
    endTimeInput.max = duration;
    endTimeInput.value = duration;
    updateCurrentTime();
  });

  videoPlayer.addEventListener("timeupdate", () => {
    const startTime = parseFloat(startTimeInput.value);
    const endTime = parseFloat(endTimeInput.value);
    const currentTime = videoPlayer.currentTime;
    if (currentTime < startTime) {
      videoPlayer.currentTime = startTime;
    } else if (endTime <= videoPlayer.currentTime) {
      videoPlayer.currentTime = startTime;
      videoPlayer.play();
    }
    updateCurrentTime();
  });
}

const secondsToTimeString = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}