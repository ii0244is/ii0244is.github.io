const init = () => {
  const timeRangeSlider = new TimeRangeSlider("time-range-slider");
  const videoPlayer = document.getElementById("video");
  const startTimeInput = document.getElementById("startTime");
  const endTimeInput = document.getElementById("endTime");
  const currentTimeDisplay = document.getElementById("currentTime");

  const updateStartTime = (startTime) => {
    startTimeInput.value = startTime.toFixed(3);
    const endTime = parseFloat(endTimeInput.value);
    const duration = videoPlayer.duration;
    timeRangeSlider.setRange(startTime / duration, endTime / duration);
    const currentTime = videoPlayer.currentTime;
    if (currentTime < startTime) {
      videoPlayer.currentTime = startTime;
      timeRangeSlider.setCurrent(startTime / duration);
    }
  }

  const updateEndTime = (endTime) => {
    endTimeInput.value = endTime.toFixed(3);
    const startTime = parseFloat(startTimeInput.value);
    const duration = videoPlayer.duration;
    timeRangeSlider.setRange(startTime / duration, endTime / duration);
  }

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

  startTimeInput.addEventListener("change", () => {
    let startTime = parseFloat(startTimeInput.value);
    const endTime = parseFloat(endTimeInput.value);
    if (startTime >= endTime) {
      startTime = endTime - 0.1;
    }
    if (videoPlayer.currentTime < startTime) {
      videoPlayer.currentTime = startTime;
    }
    updateStartTime(startTime);
  });

  const setStartTimeButton = document.getElementById("setStartTime");
  setStartTimeButton.addEventListener("click", () => {
    const currentTime = videoPlayer.currentTime;
    updateStartTime(currentTime);
  });

  endTimeInput.addEventListener("change", () => {
    const startTime = parseFloat(startTimeInput.value);
    let endTime = parseFloat(endTimeInput.value);
    if (endTime <= startTime) {
      endTime = startTime + 0.1;
    }
    if (endTime <= videoPlayer.currentTime) {
      videoPlayer.currentTime = endTime;
    }
    updateEndTime(endTime);
  });

  const setEndTimeButton = document.getElementById("setEndTime");
  setEndTimeButton.addEventListener("click", () => {
    const currentTime = videoPlayer.currentTime;
    updateEndTime(currentTime);
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
    timeRangeSlider.setRange(0, 1);
    timeRangeSlider.resize();
    updateCurrentTime();
  });

  videoPlayer.addEventListener("timeupdate", () => {
    const startTime = parseFloat(startTimeInput.value);
    const endTime = parseFloat(endTimeInput.value);
    const currentTime = videoPlayer.currentTime;
    const duration = videoPlayer.duration;
    timeRangeSlider.setCurrent(currentTime / duration);
    if (currentTime < startTime) {
      videoPlayer.currentTime = startTime;
    } else if (endTime <= videoPlayer.currentTime) {
      videoPlayer.currentTime = startTime;
      videoPlayer.play();
    }
    updateCurrentTime();
  });

  timeRangeSlider.onChangeStart = (value) => {
    const duration = videoPlayer.duration;
    const startTime = value * duration;
    updateStartTime(startTime);
  }

  timeRangeSlider.onChangeEnd = (value) => {
    const duration = videoPlayer.duration;
    const endTime = value * duration;
    updateEndTime(endTime);
  }

  timeRangeSlider.onChangeCurrent = (value) => {
    const duration = videoPlayer.duration;
    const currentTime = value * duration;
    videoPlayer.currentTime = currentTime;
    timeRangeSlider.setCurrent(currentTime / duration);
  }
}

const secondsToTimeString = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

class TimeRangeSlider {
  constructor(domId) {
    this.dom = document.getElementById(domId);
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.dom.clientWidth;
    this.canvas.height = this.dom.clientHeight;
    this.dom.appendChild(this.canvas);
    this.current = 0;
    this.start = 0;
    this.end = 1;
    this.clicked = '';
    this.canvas.addEventListener("pointerdown", (event) => this.pointerDown(event));
    this.canvas.addEventListener("pointermove", (event) => this.pointerMove(event));
    this.canvas.addEventListener("pointerup", () => this.clicked = '');
    window.addEventListener("resize", () => this.resize());
    this.resize();
  }

  setCurrent = (current) =>{
    this.current = current;
    this.draw();
  }

  setRange = (start, end) => {
    this.start = start;
    this.end = end;
    this.draw();
  }

  resize = () => {
    this.canvas.width = this.dom.clientWidth;
    this.canvas.height = this.dom.clientHeight;
    this.draw();
  }

  draw = () => {
    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const width = this.canvas.width;
    const height = this.canvas.height;
    const startX = this.start * width;
    const endX = this.end * width;
    const currentX = this.current * width;

    ctx.fillStyle = "#ccc";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#666";
    ctx.fillRect(0, 0, startX, height);
    ctx.fillStyle = "#46c";
    ctx.fillRect(startX, 0, currentX - startX, height);
    ctx.fillStyle = "#666";
    ctx.fillRect(endX, 0, width - endX, height);

    const KNOB_WIDTH = 8;
    ctx.fillStyle = "#f00";
    ctx.fillRect(startX, 0, KNOB_WIDTH, height);
    ctx.fillRect(endX - KNOB_WIDTH, 0, KNOB_WIDTH, height);
  }

  pointerDown = (event) => {
    const x = event.offsetX;
    const width = this.canvas.width;
    const startX = this.start * width;
    const endX = this.end * width;
    const KNOB_WIDTH = 20;

    if (startX - KNOB_WIDTH <= x && x <= startX + KNOB_WIDTH) {
      this.clicked = 'start';
    } else if (endX - KNOB_WIDTH <= x && x <= endX + KNOB_WIDTH) {
      this.clicked = 'end';
    } else if (startX <= x && x <= endX) {
      this.clicked = 'current';
    }
  }

  pointerMove = (event) => {
    if (this.clicked === '') {
      return;
    }

    const x = event.offsetX;
    const width = this.canvas.width;
    const value = x / width;
    if (this.clicked === 'start') {
      this.onChangeStart(Math.min(value, this.end));
    } else if (this.clicked === 'end') {
      this.onChangeEnd(Math.max(value, this.start));
    } else if (this.clicked === 'current') {
      this.onChangeCurrent(Math.min(Math.max(value, this.start), this.end));
    }
  }
}