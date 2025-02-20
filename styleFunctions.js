const mainObj = document.getElementById("main");
const nav = document.getElementById("stickyNav");
const navTitle = document.getElementById("navTitle");
const mainTitle = document.getElementById("title");

const controlsContainer = document.getElementById("controls");

mainObj.addEventListener("scroll", () => {
    if (mainTitle.getBoundingClientRect().top <= 0) 
    {
        navTitle.style.opacity = 1;
        nav.classList.add("sticky");
        controlsContainer.classList.add("collapsed");
    }
    else 
    {
        navTitle.style.opacity = 0;
        nav.classList.remove("sticky");
        controlsContainer.classList.remove("collapsed");
    }
});

if(info.name != "" || info.workplace != "")
{
    navTitle.textContent = `${info.name}, ${info.workplace}`;
} 

controlsContainer.addEventListener("click", () => {
    controlsContainer.classList.remove("collapsed");
});

const settingsMenu = document.getElementById("settingsMenu");
const addHoursMenu = document.getElementById("addHoursMenu");

settingsMenu.addEventListener("click", () => {
    settingsMenu.classList.remove("open");
});

addHoursMenu.addEventListener("click", () => {
    addHoursMenu.classList.remove("open");
});