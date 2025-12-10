window.addEventListener("load",main,false);
//localStorage.clear();
function main(event){
    topNavbar();
    bannerCarousel();
    todoApp();
    notesApp();
    ghostEffect();
}


function topNavbar(){
    const menuIcon = document.querySelector("#menu-icon");
    
    const navbarUl = document.querySelector("#top-navbar ul");
    menuIcon.addEventListener("click",(e)=>{
        const display = window.getComputedStyle(navbarUl).getPropertyValue("display");
        
        if (display=="none"){
            navbarUl.style.display ="block";
        menuIcon.src = "images/close.png"}
        else{
            navbarUl.style.display ="none";
        menuIcon.src = "images/menuicon01.png"}
    },false);
}


function bannerCarousel(){
    const text = "Hello Human, welcome to notes jerky";
    
    const carousel = document.querySelector(".banner-carousel");
    const item1 = document.querySelector(".banner-carousel #one");
    const item2 = document.querySelector(".banner-carousel #two");
    const item3 = document.querySelector(".banner-carousel #three");
     
    
    
    const obs = new IntersectionObserver((entries)=>{
        entries.forEach((entry)=>{
        if (entry.isIntersecting){
            entry.target.textContent = text;
            entry.target.classList.add("show");
            
        }
        else{
            entry.target.textContent = "";
            entry.target.classList.remove("show")
        }
        })
    });
    const items = document.querySelectorAll(".item p");
    items.forEach((el)=>{obs.observe(el)})
}


function todoApp(){
    
    /* event listener attacher functions below. They are responsible for creating and attaching event listeners on render and re render of all or part of the DOM */
      function  addDeleteTaskEventListener(){
          [...document.getElementsByClassName("delete-task-btn")].forEach((btn)=>{
    btn.addEventListener("click",(e)=>{deleteTask(btn.id)},false)
})
}
    
    
    function addEditTaskPopupEventListeners(){
        
        [...document.querySelectorAll(".edit-task-btn")].forEach((btn)=>{
            btn.addEventListener("click",(e)=>{
                const taskForm = document.querySelector("#edit-task-popup-form")
            taskForm.style.display = "grid";
            const tasks =  getTasks();
            const task = tasks.filter(t=>t.time === btn.id)[0];
            taskForm.taskText.value = task.text;
            taskForm.priority.value = task.priority;
                taskForm.taskId.value = task.time;
            },false); 
        });   
        document.querySelector("#close-edit-popup-icon").addEventListener("click",(e)=>{document.querySelector("#edit-task-popup-form").style.display = "none";},false)
        
document.querySelector("#edit-task-popup-form").addEventListener("submit",(e)=>{
    e.preventDefault();
    const text = e.target.taskText.value;
    const priority = e.target.priority.value;
    const id = e.target.taskId.value;
    let tasks =  getTasks();
    tasks = tasks.map((t)=>{if(t.time === id){
        t.text = text;
        t.priority = priority;
        return t;
    }
        else{return t}
    });
     setTasks(tasks);
    e.target.style.display = "none";
    updateTasks();
},false);    
    }
    
    function addToggleBarEventListener(){
        [...document.querySelectorAll(".toggle-bar-icon")].forEach((btn)=>{btn.addEventListener("click",(e)=>{
            let tasks = getTasks();
            let id = e.target.id.split("-")[1];
            tasks = tasks.map((t)=>{
                if (t.time == id){
                    t.status = t.status?false:true;
                    if (t.status){
                        e.target.classList.add("active-toggle-bar");
                    }
                    else{
                        e.target.classList.remove("active-toggle-bar");
                    }
                    return t;
                }
                else{return t}
            })
            setTasks(tasks);
        },false);
        });
    }
    
    // End of event listener attacher functions
    
    
    function getTasks(){
        let tasks = localStorage.getItem("tasks");
        tasks = JSON.parse(tasks);
        if(tasks == null){
            tasks = [];
        }
        return tasks;
        // end of getTask function
    }
    
    function setTasks(tasks){
        localStorage.setItem("tasks",JSON.stringify(tasks))
        // end of setTasks function
    }
    
    
    function addTask(text, priority){
        let tasks = getTasks();
        tasks.push({text:text,priority:priority,time:new Date().toLocaleString(),status:false});
        setTasks(tasks)
        updateTasks();
        // end of addTask function
    }
    
    function updateTasks(){
        const taskListEl = document.querySelector(".modal .task-list");
        let tasks = localStorage.getItem("tasks");
        
        if (tasks == null || JSON.parse(tasks).length== 0){
            taskListEl.innerHTML = `<div class="alert alert-info">No Tasks Available</div>`;
        }
        else{
            let buffer = "";
            tasks = JSON.parse(tasks);
            tasks.reverse();// new first;
            for (task of tasks){
                let statusClass = task.status?"active-toggle-bar":"";
                buffer += ` <div class="task-cont">
      <div class="task-item">
        <li class="task">${task.text}</li><button class="btn edit-task-btn" id="${task.time}">edit</button><button class="btn delete-task-btn" id="${task.time}">delete</button>
      </div>
      <div class="status">
        <time>${task.time}</time>
        <span class="category">priority: ${task.priority}</span>
                <div class="toggle-bar"><div class="toggle-bar-icon ${statusClass}" id="t-${task.time}"></div></div>
      </div>
      </div>`;
            }
        taskListEl.innerHTML = buffer;
        }
        // recrete event listeners here
        addDeleteTaskEventListener();
        addEditTaskPopupEventListeners();
addToggleBarEventListener();        
        // end of updateTasks function
    }
    
    function deleteTask(taskId){
        let tasks = getTasks();
        tasks = tasks.filter(task=>task.time !== taskId);
        setTasks(tasks);
        updateTasks();
        // end of deleteTask function
    }
    
    
    
    const openBtn = document.querySelector("#open-todo-btn");
    const closeIcon = document.querySelector("#close-todo-icon");
    const taskForm = document.querySelector(".task-form");
    const taskTextarea = document.querySelector("#task-textarea");
    
    const todoModal = document.querySelector("#todo-app");
    
updateTasks();

    openBtn.addEventListener("click",(e)=>{
        todoModal.style.display = "grid";
    },false);
    
 closeIcon.addEventListener("click",(e)=>{
     todoModal.style.display = "none";
 },false);   
    
taskForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const taskText = taskTextarea.value;
    taskTextarea.value = ""; // clear the textarea input
    const taskPriority = taskForm.priority.value;
   if (taskText.trim()!==""){ addTask(taskText,taskPriority);}
},false);    
}





function notesApp(){
    const openBtn = document.querySelector("#open-notes-btn");
    const notesModal = document.querySelector("#notes-app");
    
    openBtn.addEventListener("click",(e)=>{
        notesModal.style.display = "grid";
    },false)
    
}





function ghostEffect(){
    
        const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => {
                if (entry.isIntersecting) {
                        entry.target.classList.add("show");
    }
                else {
      entry.target.classList.remove("show");
    }
  });
});

document.querySelectorAll("section").forEach((el) => observer.observe(el));
}


