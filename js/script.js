// ============================================================================
// DOM ELEMENTS INITIALIZATION
// Fetching elements from the HTML to interact with them via JavaScript
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  const timerDisplay = document.getElementById("timer");
  const startBtn = document.getElementById("startBtn");
  const restBtn = document.getElementById("restBtn"); // The new REST button
  const resetBtn = document.getElementById("resetBtn");
  const alarmSound = document.getElementById("alarmSound");
  const musicBtn = document.getElementById("musicBtn");
  const bgMusic = document.getElementById("bgMusic");
  
  // Custom Mode Indicators
  const modeTitle = document.getElementById("modeTitle");
  const workIndicator = document.getElementById("workIndicator");
  const restIndicator = document.getElementById("restIndicator");

  // ============================================================================
  // TIMER VARIABLES & STATE
  // ============================================================================
  const STUDY_TIME = 50 * 60; // 50 minutes in seconds
  const REST_TIME = 10 * 60; // 10 minutes in seconds
  let time = STUDY_TIME; // Initial time is study time
  let interval = null;
  let isRunning = false;
  let currentMode = "study"; // Can be 'study' or 'rest'

  // ============================================================================
  // CORE TIMER UPDATE FUNCTION
  // Handles decrementing time, updating display, and triggering alarm
  // ============================================================================
  function updateTimer() {
    if (time === 0) {
      clearInterval(interval);
      isRunning = false;

      alarmSound.currentTime = 0;
      alarmSound.play();

      setTimeout(() => {
        alert("Waktu habis! 🔔");
        alarmSound.pause();
        alarmSound.currentTime = 0;
      }, 100);
      return;
    }

    time--;

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  // ============================================================================
  // HELPER FUNCTION: FORMAT AND DISPLAY INITIAL TIME
  // ============================================================================
  function displayTime(secondsTotal) {
    const m = Math.floor(secondsTotal / 60);
    const s = secondsTotal % 60;
    timerDisplay.textContent = `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  // ============================================================================
  // START/PAUSE BUTTON LOGIC
  // Toggles the timer interval and updates button text
  // ============================================================================
  startBtn.addEventListener("click", () => {
    // If we were on rest, switch to study mode when pressing start
    if (currentMode === "rest") {
        currentMode = "study";
        time = STUDY_TIME;
        displayTime(time);
        restBtn.textContent = "REST"; // Reset rest button text
        
        // Update UI Indicators
        modeTitle.textContent = "WORK TIME";
        workIndicator.classList.add("active");
        restIndicator.classList.remove("active");
        timerDisplay.style.color = "var(--bg)"; // Orange for work
    }

    if (!isRunning) {
      updateTimer(); // Trigger first second immediately
      interval = setInterval(updateTimer, 1000);
      isRunning = true;
      startBtn.textContent = "PAUSE";
    } else {
      clearInterval(interval);
      isRunning = false;
      startBtn.textContent = "START";
    }
  });

  // ============================================================================
  // REST BUTTON LOGIC
  // Sets timer to 10 minutes and toggles start/pause for rest mode
  // ============================================================================
  restBtn.addEventListener("click", () => {
    // If currently studying, switch to rest mode
    if (currentMode === "study") {
        clearInterval(interval);
        isRunning = false;
        currentMode = "rest";
        time = REST_TIME;
        displayTime(time);
        startBtn.textContent = "START"; // Reset start button text
        
        // Update UI Indicators
        modeTitle.textContent = "REST TIME";
        workIndicator.classList.remove("active");
        restIndicator.classList.add("active");
        timerDisplay.style.color = "var(--rest)"; // Blue for rest
    }

    // Toggle rest timer start/pause
    if (!isRunning) {
      updateTimer(); // Trigger first second immediately
      interval = setInterval(updateTimer, 1000);
      isRunning = true;
      restBtn.textContent = "PAUSE";
    } else {
      clearInterval(interval);
      isRunning = false;
      restBtn.textContent = "REST";
    }
  });

  // ============================================================================
  // RESET BUTTON LOGIC
  // Stops timer and restores to 50 minutes study mode
  // ============================================================================
  resetBtn.addEventListener("click", () => {
    clearInterval(interval);
    currentMode = "study";
    time = STUDY_TIME;
    isRunning = false;
    startBtn.textContent = "START";
    restBtn.textContent = "REST";
    displayTime(time);
    
    // Reset UI Indicators
    modeTitle.textContent = "WORK TIME";
    workIndicator.classList.add("active");
    restIndicator.classList.remove("active");
    timerDisplay.style.color = "var(--bg)";
  });

  // ============================================================================
  // STICKY NOTE TODO LIST LOGIC
  // Creates, checks, and deletes task items
  // ============================================================================
  const taskInput = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const taskList = document.getElementById("taskList");

  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
      const li = document.createElement("li");
      li.className = "task-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "checkbox";
      checkbox.addEventListener("change", function () {
        if (this.checked) {
          li.classList.add("completed");
        } else {
          li.classList.remove("completed");
        }
      });

      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = taskText;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerHTML = "&times;";
      deleteBtn.addEventListener("click", () => {
        li.remove();
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteBtn);

      taskList.appendChild(li);
      taskInput.value = "";
    }
  }
  // ============================================================================
  // BACKGROUND MUSIC TOGGLE LOGIC
  // Plays/Pauses the background music and manages active button styling
  // ============================================================================
  let isMusicPlaying = false;
  musicBtn.addEventListener("click", () => {
    if (isMusicPlaying) {
      bgMusic.pause();
      isMusicPlaying = false;
      musicBtn.classList.remove("active");
    } else {
      bgMusic.play();
      isMusicPlaying = true;
      musicBtn.classList.add("active");
    }
  });

  // ============================================================================
  // GENERAL EVENT LISTENERS
  // Link UI actions to logic functions
  // ============================================================================
  addBtn.addEventListener("click", addTask);

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  // ============================================================================
  // EXTERNAL LIBRARIES INITIALIZATION
  // Render feather icons
  // ============================================================================
  if (typeof feather !== "undefined") {
    feather.replace();
  }
});
