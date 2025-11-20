document.addEventListener("DOMContentLoaded", function () {
  const welcomeScreen = document.getElementById("welcomeScreen");
  const appContent = document.getElementById("appContent");
  const boyBtn = document.getElementById("boyBtn");
  const girlBtn = document.getElementById("girlBtn");
  const themeToggle = document.getElementById("themeToggle");
  const addTaskModalBtn = document.getElementById("addTaskModalBtn");
  const taskGrid = document.getElementById("taskGrid");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const totalTasksEl = document.getElementById("totalTasks");
  const pendingTasksEl = document.getElementById("pendingTasks");
  const completedTasksEl = document.getElementById("completedTasks");
  const highPriorityTasksEl = document.getElementById("highPriorityTasks");
  const saveTaskBtn = document.getElementById("saveTaskBtn");
  const taskForm = document.getElementById("taskForm");

  const addTaskModal = new bootstrap.Modal(
    document.getElementById("addTaskModal")
  );

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all";
  let currentPriorityFilter = "all";
  let currentTheme = localStorage.getItem("theme") || "light";
  let userGender = localStorage.getItem("gender") || null;
  let editingTaskId = null;

  function initApp() {
    if (userGender) {
      welcomeScreen.classList.add("d-none");
      appContent.classList.remove("d-none");
      document.body.setAttribute("data-gender", userGender);
      document.body.setAttribute("data-theme", currentTheme);
      updateThemeIcon();
      renderTasks();
    }

    const today = new Date().toISOString().split("T")[0];
    document.getElementById("startDate").value = today;
    document.getElementById("endDate").min = today;
  }

  boyBtn.addEventListener("click", function () {
    setGender("boy");
  });

  girlBtn.addEventListener("click", function () {
    setGender("girl");
  });

  themeToggle.addEventListener("click", function () {
    toggleTheme();
  });

  addTaskModalBtn.addEventListener("click", function () {
    editingTaskId = null;
    taskForm.reset();
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("startDate").value = today;
    document.getElementById("endDate").min = today;
    addTaskModal.show();
  });

  saveTaskBtn.addEventListener("click", function () {
    saveTask();
  });

  document.getElementById("startDate").addEventListener("change", function () {
    document.getElementById("endDate").min = this.value;
  });

  /* --- FIX: Correctly manage state for both filter and priority buttons --- */
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const isPriorityFilter = this.hasAttribute("data-priority");
      const filterType = isPriorityFilter ? "data-priority" : "data-filter";
      const newValue = this.getAttribute(filterType);

      // Remove 'active' from all buttons of the same type
      document
          .querySelectorAll(`[${filterType}]`)
          .forEach((b) => b.classList.remove("active"));
      
      // Set 'active' on the clicked button
      this.classList.add("active");

      // Update the state variables
      if (isPriorityFilter) {
          currentPriorityFilter = newValue;
      } else {
          currentFilter = newValue;
      }
      renderTasks();
    });
  });
  /* ----------------------------------------------------------------------- */

  function setGender(gender) {
    userGender = gender;
    localStorage.setItem("gender", gender);
    document.body.setAttribute("data-gender", gender);
    welcomeScreen.classList.add("d-none");
    appContent.classList.remove("d-none");
    renderTasks();

    Swal.fire({
      title: `Welcome ${gender === "boy" ? "Boy" : "Girl"}!`,
      text: `Your theme has been set to ${gender === "boy" ? "Blue" : "Pink"}.`,
      icon: "success",
      confirmButtonColor: gender === "boy" ? "#3498db" : "#e84393",
      timer: 2000,
      showConfirmButton: false,
    });
  }

  function toggleTheme() {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    document.body.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
    updateThemeIcon();
  }

  function updateThemeIcon() {
    const icon = themeToggle.querySelector("i");
    if (currentTheme === "dark") {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    }
  }

  function saveTask() {
    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!title || !startDate || !endDate) {
      Swal.fire({
        title: "Oops!",
        text: "Please fill in all required fields",
        icon: "warning",
        confirmButtonColor: getPrimaryColor(),
      });
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      Swal.fire({
        title: "Invalid Dates",
        text: "End date cannot be before start date",
        icon: "warning",
        confirmButtonColor: getPrimaryColor(),
      });
      return;
    }

    const taskData = {
      title,
      description,
      startDate,
      endDate,
      priority: calculatePriority(startDate, endDate),
    };

    if (editingTaskId) {
      tasks = tasks.map((task) =>
        task.id === editingTaskId ? { ...task, ...taskData } : task
      );
    } else {
      const newTask = {
        id: Date.now(),
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      tasks.unshift(newTask);
    }

    saveTasks();
    addTaskModal.hide();
    renderTasks();

    Swal.fire({
      title: editingTaskId ? "Task Updated!" : "Task Added!",
      text: `Your task has been ${
        editingTaskId ? "updated" : "added"
      } successfully`,
      icon: "success",
      confirmButtonColor: getPrimaryColor(),
      timer: 1500,
      showConfirmButton: false,
    });
  }

  /* --- FIX: Standardize date comparison to the start of the day --- */
  function calculatePriority(startDate, endDate) {
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set today's time to midnight for accurate day calculation
    
    const timeDiff = end.getTime() - today.getTime();
    const daysDiff = Math.round(timeDiff / (1000 * 3600 * 24)); // Use Math.round for consistent results

    if (daysDiff <= 1) return "high"; // Due today (0) or tomorrow (1)
    if (daysDiff <= 3) return "medium";
    return "low";
  }
  /* ----------------------------------------------------------------- */

  function deleteTask(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        tasks = tasks.filter((task) => task.id !== id);
        saveTasks();
        renderTasks();

        Swal.fire({
          title: "Deleted!",
          text: "Your task has been deleted.",
          icon: "success",
          confirmButtonColor: getPrimaryColor(),
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }

  function toggleTaskCompletion(id) {
    tasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    saveTasks();
    renderTasks();
  }

  function editTask(id) {
    const task = tasks.find((task) => task.id === id);
    editingTaskId = id;

    document.getElementById("taskTitle").value = task.title;
    document.getElementById("taskDescription").value = task.description;
    document.getElementById("startDate").value = task.startDate;
    document.getElementById("endDate").value = task.endDate;
    document.getElementById("endDate").min = task.startDate;

    addTaskModal.show();
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateStats();
  }

  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const highPriority = tasks.filter(
      (task) => !task.completed && task.priority === "high"
    ).length;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
    highPriorityTasksEl.textContent = highPriority;
  }

  function renderTasks() {
    let filteredTasks = tasks.filter((task) => {
      const filterMatch =
        currentFilter === "all" ||
        (currentFilter === "pending" && !task.completed) ||
        (currentFilter === "completed" && task.completed);

      const priorityMatch =
        currentPriorityFilter === "all" ||
        task.priority === currentPriorityFilter;

      return filterMatch && priorityMatch;
    });

    if (filteredTasks.length === 0) {
      taskGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>No tasks found</p>
            </div>
        `;
    } else {
      taskGrid.innerHTML = filteredTasks
        .map(
          (task) => `
            <div class="task-card ${task.priority}-priority ${
            task.completed ? "completed" : ""
          } ${isUrgent(task) ? "urgent" : ""}">
                <div class="card-body">
                    <div class="task-header">
                        <h5 class="task-title">${task.title}</h5>
                        <span class="task-priority priority-${task.priority}">
                            ${
                              task.priority.charAt(0).toUpperCase() +
                              task.priority.slice(1)
                            }
                        </span>
                    </div>
                    ${
                      task.description
                        ? `<p class="task-description">${task.description}</p>`
                        : ""
                    }
                    <div class="task-dates">
                        <div class="date-item">
                            <span class="date-label">Start</span>
                            <span class="date-value">${formatDate(
                              task.startDate
                            )}</span>
                        </div>
                        <div class="date-item">
                            <span class="date-label">End</span>
                            <span class="date-value">${formatDate(
                              task.endDate
                            )}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="task-action-btn complete-btn" onclick="app.toggleTaskCompletion(${
                          task.id
                        })">
                            <i class="fas ${
                              task.completed ? "fa-undo" : "fa-check"
                            }"></i>
                            ${task.completed ? "Undo" : "Complete"}
                        </button>
                        <button class="task-action-btn edit-btn" onclick="app.editTask(${
                          task.id
                        })">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="task-action-btn delete-btn" onclick="app.deleteTask(${
                          task.id
                        })">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `
        )
        .join("");
    }

    updateStats();
  }

  /* --- FIX: Standardize date comparison to the start of the day for urgency --- */
  function isUrgent(task) {
    if (task.completed) return false;
    const endDate = new Date(task.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    const timeDiff = endDate.getTime() - today.getTime();
    const daysDiff = Math.round(timeDiff / (1000 * 3600 * 24));
    
    // Task is urgent if it is due today or has passed (daysDiff <= 0)
    return daysDiff <= 0; 
  }
  /* ----------------------------------------------------------------------------- */


  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  function getPrimaryColor() {
    return userGender === "boy" ? "#3498db" : "#e84393";
  }

  const app = {
    toggleTaskCompletion,
    editTask,
    deleteTask,
  };

  window.app = app;

  initApp();
});