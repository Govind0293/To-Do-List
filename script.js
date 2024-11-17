const inputBox = document.getElementById("input-box");
const prioritySelect = document.getElementById("priority-select");
const listContainer = document.getElementById("list-container");

// Event listener for changing the background color based on priority
prioritySelect.addEventListener('change', function() {
    const selectedPriority = prioritySelect.value;
    
    // Remove existing priority classes
    prioritySelect.classList.remove('priority-high', 'priority-medium', 'priority-easy');
    
    // Add the new priority class
    if (selectedPriority === 'high') {
        prioritySelect.classList.add('priority-high');
    } else if (selectedPriority === 'medium') {
        prioritySelect.classList.add('priority-medium');
    } else if (selectedPriority === 'low') {
        prioritySelect.classList.add('priority-easy');
    }
});

function addTask() {
    if (inputBox.value === '') {
        alert("Write something");
    } else {
        let li = document.createElement("li");
        li.setAttribute("draggable", "true");
        li.dataset.priority = prioritySelect.value;  // Set priority data attribute
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
        addDragAndDropEvents(li);
        applyPriorityClass(li);  // Apply priority class for styling
    }
    inputBox.value = "";
    saveData();
}

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
});

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
    let items = listContainer.querySelectorAll("li");
    items.forEach(item => {
        item.setAttribute("draggable", "true");
        addDragAndDropEvents(item);
        applyPriorityClass(item);  // Apply priority class on load
    });
}

function addDragAndDropEvents(item) {
    item.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text/plain", e.target.innerHTML);
        item.classList.add("dragging");
    });

    item.addEventListener("dragover", function (e) {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        const applyAfter = (e.clientY - item.getBoundingClientRect().top) > (item.clientHeight / 2);
        if (applyAfter) {
            item.insertAdjacentElement('afterend', dragging);
        } else {
            item.insertAdjacentElement('beforebegin', dragging);
        }
    });

    item.addEventListener("dragend", function () {
        item.classList.remove("dragging");
        saveData();
    });
}

function applyPriorityClass(item) {
    const priority = item.dataset.priority;
    item.classList.remove('high', 'medium', 'low');
    if (priority === 'high') {
        item.classList.add('high');
    } else if (priority === 'medium') {
        item.classList.add('medium');
    } else {
        item.classList.add('low');
    }
}

showTask();

