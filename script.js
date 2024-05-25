$(document).ready(function () {
  // Load tasks from localStorage on page load
  loadTasks();

  // Add Task button click event
  $("#add-task-btn").click(function () {
    $("#task-modal").css("display", "block");
  });

  // Close modal
  $(".close").click(function () {
    $("#task-modal").css("display", "none");
  });

  // Save Task button click event
  $("#save-task-btn").click(function () {
    saveTask();
  });

  // Drag and drop functionality
  $(".column").sortable({
    connectWith: ".column",
    update: function (event, ui) {
      updateTaskStatus();
    },
  });
});

function loadTasks() {
  // Check if tasks exist in localStorage
  if (localStorage.getItem("tasks")) {
    // Retrieve tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks"));

    // Loop through tasks and display them on the task board
    tasks.forEach((task) => {
      displayTask(task);
    });
  }
}

function displayTask(task) {
  // Create task card HTML
  let taskHTML = `
        <div class="task" id="${task.id}">
            <div class="task-title">${task.title}</div>
            <div class="task-description">${task.description}</div>
            <div class="task-deadline">Deadline: ${task.deadline}</div>
            <button class="delete-task-btn" onclick="deleteTask('${task.id}')">Delete</button>
        </div>
    `;

  // Append task card to the corresponding column based on task status
  $("#" + task.status + "-column").append(taskHTML);
}

function saveTask() {
  // Get input values
  let title = $("#task-title").val();
  let description = $("#task-description").val();
  let deadline = $("#task-deadline").val();
  let status = "not-started"; // By default, new tasks are not started

  // Generate unique task ID
  let taskId = "task-" + Date.now();

  // Create task object
  let task = {
    id: taskId,
    title: title,
    description: description,
    deadline: deadline,
    status: status,
  };

  // Save task to localStorage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Display task on the task board
  displayTask(task);

  // Close modal
  $("#task-modal").css("display", "none");

  // Clear input fields
  $("#task-title").val("");
  $("#task-description").val("");
  $("#task-deadline").val("");
}

function updateTaskStatus() {
  // Get tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Loop through columns
  $(".column").each(function () {
    let columnId = $(this).attr("id");
    let columnTasks = $(this).find(".task");

    // Loop through tasks in the current column
    columnTasks.each(function () {
      let taskId = $(this).attr("id");

      // Find the corresponding task in the tasks array
      let taskIndex = tasks.findIndex((task) => task.id === taskId);

      // Update task status based on column
      tasks[taskIndex].status = columnId;
    });
  });

  // Save updated tasks to localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

$(function () {
  $(".task").draggable();
  $(".column").droppable({
    drop: function (event, ui) {
      $(this).addClass("ui-state-highlight");
    },
  });
});
