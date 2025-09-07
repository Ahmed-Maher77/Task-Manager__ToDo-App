// ============================== DOM Elements ==============================
const addBtn = document.getElementById("addBtn");
const removeAllBtn = document.querySelector(".removeAll");
const input = document.getElementById("taskInput");
const searchInput = document.getElementById("searchInput");
const searchToggleBtn = document.getElementById("searchToggle");
const searchPanel = document.getElementById("searchPanel");
const currentTasks = document.querySelector(".current-tasks");
const completedTasks = document.querySelector(".completed-tasks");
const loader = document.getElementById("loader");

// ============================== State Management ==============================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [
	{
		id: 1722631507498,
		content: "The default task was set by the programmer {Ahmed Maher}.",
		completed: false,
	},
];
let modifiedId; // ID for the task being edited
let searchQuery = ""; // Current search query

// ============================== Initialization ==============================
window.addEventListener("load", function () {
	setTimeout(function () {
		loader.classList.add("hidden");
		window.scrollTo(0, 0);
		setTimeout(function () {
			loader.style.display = "none";
		}, 500);
	}, 1500);
});

displayTasks(getFilteredTasks());

// ============================== Event Handlers ==============================
// Add Task (button click)
addBtn.onclick = function (e) {
	e.preventDefault();
	handleTaskSubmission();
};

// Add Task (input keydown)
input.addEventListener("keydown", function (e) {
	if (e.key === "Enter") {
		e.preventDefault();
		handleTaskSubmission();
	}
});

// Live Search
if (searchInput) {
	searchInput.addEventListener("input", function (e) {
		searchQuery = e.target.value || "";
		displayTasks(getFilteredTasks());
	});
}

// Toggle Search Panel
if (searchToggleBtn && searchPanel) {
	searchToggleBtn.addEventListener("click", function () {
		const isOpen = searchToggleBtn.getAttribute("aria-expanded") === "true";
		searchToggleBtn.setAttribute("aria-expanded", String(!isOpen));
		document
			.querySelector(".search-block")
			.classList.toggle("is-open", !isOpen);
		searchToggleBtn.setAttribute(
			"title",
			isOpen ? "Show search" : "Hide search"
		);
		searchToggleBtn.setAttribute(
			"aria-label",
			isOpen ? "Show search" : "Hide search"
		);
		searchPanel.classList.toggle("is-open", !isOpen);
		if (!isOpen) {
			setTimeout(() => {
				searchInput?.focus();
			}, 200);
		}
	});
}

function handleTaskSubmission() {
	if (input.value.trim().length > 0) {
		if (addBtn.innerText.includes("Add Task")) {
			createTask(input.value.trim());
		} else {
			editTask();
			resetAddButton();
		}
		input.value = "";
		input.focus(); // Keep focus for better UX
	}
}

// ============================== Task Management ==============================
function createTask(taskContent) {
	const task = {
		id: Date.now(),
		content: taskContent,
		completed: false,
	};
	tasks.push(task);
	localStorage.setItem("tasks", JSON.stringify(tasks));
	displayTasks(getFilteredTasks());
}

function editTask() {
	tasks.forEach((task) => {
		if (task.id === modifiedId) {
			task.content = input.value.trim();
		}
	});
	localStorage.setItem("tasks", JSON.stringify(tasks));
	displayTasks(getFilteredTasks());
}

// ============================== DOM Rendering ==============================
function displayTasks(tasksArray) {
	const contentContainer = document.querySelector(".content");
	// Hide content only if there are absolutely no tasks at all
	contentContainer.classList.toggle("hide", tasks.length === 0);

	currentTasks.innerHTML = "";
	completedTasks.innerHTML = "";

	const heading = document.createElement("h3");
	heading.innerText = "Completed Tasks:";
	completedTasks.appendChild(heading);

	tasksArray.forEach((task, index) => {
		const taskDiv = createTaskDiv(task);
		taskDiv.style.setProperty("--task-delay", index);
		if (task.completed) {
			completedTasks.appendChild(taskDiv);
		} else {
			currentTasks.appendChild(taskDiv);
		}
	});

	// No results state when searching
	if (
		tasksArray.length === 0 &&
		tasks.length > 0 &&
		searchQuery.trim().length > 0
	) {
		const noResults = document.createElement("p");
		noResults.textContent = "No tasks match your search.";
		noResults.setAttribute("role", "status");
		noResults.className = "sr-only"; // announce politely
		currentTasks.appendChild(noResults);

		const noResultsVisible = document.createElement("div");
		noResultsVisible.textContent = "No tasks match your search.";
		noResultsVisible.style.textAlign = "center";
		noResultsVisible.style.color = "#666";
		noResultsVisible.style.padding = "10px";
		currentTasks.appendChild(noResultsVisible);
	}

	removeAllBtn.innerHTML = `Remove All Tasks [${tasks.length}] <i class="fa-solid fa-trash"></i>`;
}

function createTaskDiv(task) {
	const taskDiv = document.createElement("div");
	taskDiv.classList.add("task");
	taskDiv.setAttribute("data-id", task.id);
	taskDiv.setAttribute("role", "listitem");
	taskDiv.setAttribute("aria-label", `Task: ${task.content}`);

	const taskContent = document.createElement("p");
	taskContent.innerText = task.content;
	taskContent.setAttribute("id", `task-${task.id}`);

	const taskBtns = document.createElement("div");
	taskBtns.setAttribute("role", "group");
	taskBtns.setAttribute("aria-label", "Task actions");

	const doneBtn = createButton(
		task.completed
			? "done fa-solid fa-square-check"
			: "done fa-regular fa-square-check",
		task.completed ? "Mark as incomplete" : "Mark as complete",
		"done"
	);
	const editBtn = createButton("edit fa-solid fa-pen", "Edit task", "edit");
	const deleteBtn = createButton(
		"delete fa-solid fa-trash-can",
		"Delete task",
		"delete"
	);

	// Add keyboard navigation
	doneBtn.addEventListener("keydown", handleTaskKeydown);
	editBtn.addEventListener("keydown", handleTaskKeydown);
	deleteBtn.addEventListener("keydown", handleTaskKeydown);

	taskBtns.append(doneBtn, editBtn, deleteBtn);
	taskDiv.append(taskContent, taskBtns);
	return taskDiv;
}

function createButton(classNames, title, action) {
	const btn = document.createElement("button");
	btn.className = classNames;
	btn.setAttribute("title", title);
	btn.setAttribute("aria-label", title);
	btn.setAttribute("type", "button");
	btn.setAttribute("data-action", action);
	btn.setAttribute("tabindex", "0");
	return btn;
}

// Handle keyboard navigation for task buttons
function handleTaskKeydown(e) {
	const taskId = e.target.closest(".task")?.getAttribute("data-id");
	if (!taskId) return;

	const buttons = e.target.closest(".task").querySelectorAll("button");
	const currentIndex = Array.from(buttons).indexOf(e.target);

	switch (e.key) {
		case "ArrowRight":
			e.preventDefault();
			const nextButton = buttons[currentIndex + 1];
			if (nextButton) nextButton.focus();
			break;
		case "ArrowLeft":
			e.preventDefault();
			const prevButton = buttons[currentIndex - 1];
			if (prevButton) prevButton.focus();
			break;
		case "Enter":
		case " ":
			e.preventDefault();
			e.target.click();
			break;
		case "Escape":
			e.preventDefault();
			input.focus();
			break;
	}
}

// ============================== Event Delegation ==============================
document.onclick = function (e) {
	const taskId = e.target.closest(".task")?.getAttribute("data-id");
	if (!taskId) return;

	const action = e.target.getAttribute("data-action");

	if (action === "done") {
		tasks.forEach((task) => {
			if (task.id == taskId) {
				task.completed = !task.completed;
			}
		});
		localStorage.setItem("tasks", JSON.stringify(tasks));
		displayTasks(getFilteredTasks());

		// Announce status change to screen readers
		const task = tasks.find((t) => t.id == taskId);
		announceToScreenReader(
			task.completed
				? "Task marked as complete"
				: "Task marked as incomplete"
		);
	} else if (action === "edit") {
		tasks.forEach((task) => {
			if (task.id == taskId) {
				modifiedId = task.id;
			}
		});
		input.value = e.target.closest(".task").querySelector("p").innerText;
		input.focus();
		setEditButton();
		announceToScreenReader("Editing task");
	} else if (action === "delete") {
		const taskContent = e.target
			.closest(".task")
			.querySelector("p").innerText;
		tasks = tasks.filter((task) => task.id != taskId);
		localStorage.setItem("tasks", JSON.stringify(tasks));
		displayTasks(getFilteredTasks());
		announceToScreenReader(`Task "${taskContent}" deleted`);
	}
};

// Announce messages to screen readers
function announceToScreenReader(message) {
	const announcement = document.createElement("div");
	announcement.setAttribute("aria-live", "polite");
	announcement.setAttribute("aria-atomic", "true");
	announcement.className = "sr-only";
	announcement.textContent = message;
	document.body.appendChild(announcement);

	setTimeout(() => {
		document.body.removeChild(announcement);
	}, 1000);
}

removeAllBtn.addEventListener("click", () => {
	tasks = [];
	localStorage.removeItem("tasks");
	displayTasks(getFilteredTasks());
});

// ============================== Utility Functions ==============================
function setEditButton() {
	addBtn.innerText = "Edit Task";
	addBtn.style.backgroundColor = "#26a69a";
}

function resetAddButton() {
	addBtn.innerText = "Add Task";
	addBtn.style.backgroundColor = "#ff5722";
}

function copyrightsYear() {
	const coyrigthSpan = document.getElementById("copyright-year");
	let dateNow = new Date();
	coyrigthSpan.innerHTML = dateNow.getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
	copyrightsYear();
});

// ============================== Filtering ==============================
function getFilteredTasks() {
	const query = searchQuery.trim().toLowerCase();
	if (!query) return tasks;
	return tasks.filter((task) => task.content.toLowerCase().includes(query));
}
