var timeSchedule = [];
var info = {name : "", workplace : "", hourlyRate : 0}

init();

function init()
{
    const greeting = document.getElementById("greeting");

    loadTimeSchedule();
    displayPastWorkHours();
    checkIfWorkStarted();
    displaySummery();
    
    greeting.textContent = `Hi! ${info.name}! | workplace: ${info.workplace}.`;
}

function checkIfWorkStarted() 
{
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const lastRecord = timeSchedule[timeSchedule.length - 1];
    
    if(lastRecord.end.hours === 0 && lastRecord.end.minutes === 0)
    {
        startBtn.style.display = "none";
        stopBtn.style.display = "block";

        setInterval(() => {
            updateRadialIndicator(lastRecord.start.hours, lastRecord.start.minutes);
        }, 1000);
    }
}

function loadTimeSchedule() 
{
    if (localStorage.getItem('timeSchedule')) 
    {
        timeSchedule = JSON.parse(localStorage.getItem('timeSchedule'));
    }
    if (localStorage.getItem('info')) 
    {
        info = JSON.parse(localStorage.getItem('info'));
    }
}

function startRecordHours()
{
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const formattedCurrentDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

    const CurrentDate = new Date(formattedCurrentDate);

    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");

    timeSchedule.push({
        date: CurrentDate,
        start: {hours: hours, minutes: minutes},
        end: {hours: 0, minutes: 0}
    });

    console.log("Recording hours...");
    console.log(timeSchedule)

    startBtn.style.display = "none";
    stopBtn.style.display = "block";

    updateDatabase();

    setInterval(() => {
        updateRadialIndicator(hours, minutes);
    }, 1000);
}

function stopRecordHours()
{
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const lastRecord = timeSchedule[timeSchedule.length - 1];

    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");

    lastRecord.end = {hours: hours, minutes: minutes};

    console.log("Record Stopped...");
    console.log(timeSchedule)

    startBtn.style.display = "block";
    stopBtn.style.display = "none";

    updateDatabase();
    location.reload();
}

function calculateWorkHours(startTime, endTime)
{
    const startMinutes = startTime.hours * 60 + startTime.minutes;
    const endMinutes = endTime.hours * 60 + endTime.minutes;

    const diff = endMinutes - startMinutes;

    const hours = Math.floor(diff / 60);
    const minutes = (diff % 60);

    return {hours, minutes};
}

function displayPastWorkHours() {
    const pastWorkHoursDisplay = document.getElementById("pastWorkHoursDisplay");

    // Clear previous content
    pastWorkHoursDisplay.innerHTML = "";

    for (let i = 0; i < timeSchedule.length; i++) 
    {
        const record = timeSchedule[i];
        if(record.end.hours === 0 && record.end.minutes === 0)
        {
            continue;
        }
        const { date, start, end } = record;
        const dateVar = new Date(date);

        const hours = calculateWorkHours(start, end);
        const formattedDate = `${dateVar.getDate()}/${dateVar.getMonth() + 1}/${dateVar.getFullYear()}`; // Adjust month to 1-based
    
        // Create list item and details
        const li = document.createElement("li");
        const details = document.createElement("details");
        const summary = document.createElement("summary");

        // Populate content
        summary.textContent = formattedDate + " - " + hours.hours + "h" + hours.minutes + "m.";
        details.appendChild(summary);

        // Add work hours as text inside details
        const hoursText = document.createTextNode(`You\`ve worked for ${hours.hours} hours and ${hours.minutes} minutes. and made ${(((hours.minutes / 60) + hours.hours) * info.hourlyRate).toFixed(2)}₪`);
        details.appendChild(hoursText);

        li.appendChild(details);
        pastWorkHoursDisplay.appendChild(li);
    }

    const elapsedTimeText = document.getElementById("elapsedTime");
    elapsedTimeText.classList.remove("elapsedTimeActive");
}

function updateDatabase()
{
    localStorage.setItem('timeSchedule', JSON.stringify(timeSchedule));
}

function updateRadialIndicator(startHour, startMinutes) {
    const elapsedTimeText = document.getElementById("elapsedTime");

    // Get current time
    const now = new Date();

    // Create a Date object for the starting time today
    const startTime = new Date();
    startTime.setHours(startHour, startMinutes, 0, 0);

    // Calculate the elapsed time in milliseconds
    const elapsedTime = now - startTime;

    if (elapsedTime <= 0) {
        // If the time hasn't started yet
        elapsedTimeText.textContent = "Work has not started yet.";
        return;
    }

    elapsedTimeText.classList.add("elapsedTimeActive");

    // Convert elapsed time to minutes and seconds
    const elapsedHours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const elapsedMinutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const elapsedSeconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

    // Update elapsed time text
    elapsedTimeText.textContent = `You\`ve worked for ${elapsedHours}h ${elapsedMinutes}m ${elapsedSeconds}s.`;
}

function toggleSettingsMenu()
{
    const settingsMenu = document.getElementById("settingsMenu");

    if(settingsMenu.style.display == "none" || settingsMenu.style.display == "")
    {
        settingsMenu.style.display = "block";
    }
    else
    {
        settingsMenu.style.display = "none";
    }
}

function saveInfo()
{
    info.name = document.getElementById("name").value;
    info.workplace = document.getElementById("workplace").value;
    info.hourlyRate = document.getElementById("hourlyRate").value;

    localStorage.setItem('info', JSON.stringify(info));

    toggleSettingsMenu();
    location.reload();
}

function displaySummery()
{
    const summery = document.getElementById("summery");

    let totalHoursWorked = 0;
    let totalEarningsMade = 0;

    for (let i = 0; i < timeSchedule.length; i++) 
    {
        const record = timeSchedule[i];
        if(record.end.hours === 0 && record.end.minutes === 0)
        {
            continue;
        }
        const { start, end } = record;

        const hours = calculateWorkHours(start, end);

        totalHoursWorked += hours.hours;
        totalHoursWorked += hours.minutes / 60;

        totalEarningsMade += ((hours.minutes / 60) + hours.hours) * info.hourlyRate;
    }

    li = document.createElement("li");
    li.textContent = `You\`ve worked for ${totalHoursWorked.toFixed(2)} hours and made ${totalEarningsMade.toFixed(2)}₪.`;
    summery.appendChild(li);
}

function resetData()
{
    if(confirm("Are you sure you want to reset all data?"))
    {
        timeSchedule = [];
        info = {name : "", workplace : "", hourlyRate : 0}
        localStorage.clear();
        location.reload();
    }
}