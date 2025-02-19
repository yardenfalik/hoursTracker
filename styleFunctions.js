const mainObj = document.getElementById("main");
const nav = document.getElementById("stickyNav");
const navTitle = document.getElementById("navTitle");
const mainTitle = document.getElementById("title");

mainObj.addEventListener("scroll", () => {
    if (mainTitle.getBoundingClientRect().top <= 0) 
    {
        navTitle.style.opacity = 1;
        nav.classList.add("sticky");
    }
    else 
    {
        navTitle.style.opacity = 0;
        nav.classList.remove("sticky");
    }
});

if(info.name != "" || info.workplace != "")
{
    navTitle.textContent = `${info.name}, ${info.workplace}`;
} 