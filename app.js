var timeSchedule = [];
var info = {name : "", workplace : "", hourlyRate : 0}

init();

function init()
{
    const greeting = document.getElementById("greeting");
    const title = document.getElementById("title");

    loadTimeSchedule();

    if(info.name == "" || info.workplace == "")
    {
        console.log(info.name)
        toggleMenu("settings");
    }
    else
    {
        displayPastWorkHours();
        checkIfWorkStarted();
        displaySummery();
    
        title.textContent = `👋 Hi, ${info.name}!`;
        greeting.textContent = `workplace: ${info.workplace}.`;
    } 
}

function checkIfWorkStarted() 
{
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const lastRecord = timeSchedule[timeSchedule.length - 1];
    
    if((lastRecord.end.hours == 0 && lastRecord.end.minutes == 0))
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
    const savedList = localStorage.getItem('timeSchedule');
    timeSchedule = savedList ? JSON.parse(savedList) : [];
    timeSchedule = timeSchedule.reverse();

    const savedInfo = localStorage.getItem('info');
    info =  savedInfo ? JSON.parse(savedInfo) : {name : "", workplace : "", hourlyRate : 0}; 
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
    getRandomQuote();
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

function displayPastWorkHours(data = timeSchedule.reverse()) {
    const thisMonthDisplay = document.getElementById("thisMonthDisplay");
    const pastWorkHoursDisplay = document.getElementById("pastWorkHoursDisplay");

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Clear previous content
    thisMonthDisplay.innerHTML = "";
    pastWorkHoursDisplay.innerHTML = "";

    for (let i = data.length - 1; i >= 0; i--) 
    {
        const record = data[i];

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
        const link = document.createElement("a");

        link.onclick = removeEntry(i);

        // Populate content
        summary.textContent = formattedDate + " - " + hours.hours + "h" + hours.minutes + "m.";
        details.appendChild(summary);

        // Add work hours as text inside details
        const hoursText = document.createTextNode(`${record.start.hours}:${String(record.start.minutes).padStart(2, '0')} - ${record.end.hours}:${String(record.end.minutes).padStart(2, '0')}.
         \n You've worked for ${hours.hours} hours and ${hours.minutes} minutes, and made ${(((hours.minutes / 60) + hours.hours) * info.hourlyRate).toFixed(2)}₪`);
        details.appendChild(hoursText);

        let editBtn = document.createElement("a");
        editBtn.onclick = () => editEntry(i);
        editBtn.textContent = "Edit";
        details.appendChild(editBtn);

        const xicon = document.createElement("img");

        xicon.src = "./img/XIcon.png";

        link.appendChild(xicon);
        li.appendChild(link);
        li.appendChild(details);

        if((new Date(record.date).getMonth() !== currentMonth) || (new Date(record.date).getFullYear() !== currentYear))
        {
            pastWorkHoursDisplay.appendChild(li);
        }
        else
        {
            thisMonthDisplay.appendChild(li);
        }
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

function saveInfo()
{
    info.name = document.getElementById("name").value;
    info.workplace = document.getElementById("workplace").value;
    info.hourlyRate = document.getElementById("hourlyRate").value;

    localStorage.setItem('info', JSON.stringify(info));

    toggleMenu("settings");
    location.reload();
}

function displaySummery()
{
    const summery = document.getElementById("summery");

    let totalHoursWorked = 0;
    let totalEarningsMade = 0;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < timeSchedule.length; i++) 
    {
        const record = timeSchedule[i];

        if((record.end.hours === 0 && record.end.minutes === 0) || (new Date(record.date).getMonth() !== currentMonth) || (new Date(record.date).getFullYear() !== currentYear))
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
    li.textContent = `You've worked for ${totalHoursWorked.toFixed(2)} hours and made ${totalEarningsMade.toFixed(2)}₪ this month.`;
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

function toggleMenu(type)
{   
    let menuToOpen = document.getElementById("addHoursMenu");

    if(type == "addHours")
    {
        menuToOpen = document.getElementById("addHoursMenu");
    }
    else if(type == "settings")
    {
        document.getElementById("name").value = info.name;
        document.getElementById("workplace").value = info.workplace;
        document.getElementById("hourlyRate").value = info.hourlyRate;

        menuToOpen = document.getElementById("settingsMenu");
    }
    else if(type == "editEntry")
    {
        menuToOpen = document.getElementById("editEntryMenu");
    }

    if(!menuToOpen.classList.contains("open"))
    {
        menuToOpen.classList.add("open");
    }
    else
    {
        menuToOpen.classList.remove("open");
    }
}

function addHoursMenu()
{
    const date = document.getElementById("date").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    addHours(date, startTime, endTime);
}

function forgotToStart()
{
    const startTime = document.getElementById("startTimeForgot").value;
    const date = new Date();
    
    addHours(date, startTime, "00:00");
}

function addHours(date, startTime, endTime)
{
    if(date == "" || startTime == "" || endTime == "")
    {
        location.reload();
        return;
    }

    const dateVar = new Date(date);

    const start = {hours: parseInt(startTime.split(":")[0]), minutes: parseInt(startTime.split(":")[1])};
    const end = {hours: parseInt(endTime.split(":")[0]), minutes: parseInt(endTime.split(":")[1])};

    const CurrentDate = new Date(dateVar.getFullYear(), dateVar.getMonth(), dateVar.getDate());

    timeSchedule.push({
        date: CurrentDate,
        start: start,
        end: end
    });

    updateDatabase();
    location.reload();
}

function exportData()
{
    data = timeSchedule;
    
    const headers = ['Date', 'Start Time', 'End Time', 'Duration'];
    const rows = [headers.join(',')];

    data.forEach(entry => {
        const startTime = `${entry.start.hours}:${entry.start.minutes.toString().padStart(2, '0')}`;
        const endTime = `${entry.end.hours}:${entry.end.minutes.toString().padStart(2, '0')}`;
        const startMinutes = entry.start.hours * 60 + entry.start.minutes;
        const endMinutes = entry.end.hours * 60 + entry.end.minutes;
        const durationMinutes = endMinutes - startMinutes;
        const duration = durationMinutes > 0
            ? `${Math.floor(durationMinutes / 60)}:${(durationMinutes % 60).toString().padStart(2, '0')}`
            : '0:00';

        const row = [
            new Date(entry.date).toLocaleDateString(),
            startTime,
            endTime,
            duration
        ].join(',');

        rows.push(row);
    });

    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'workHours.csv';
    link.click();
}

function getRandomQuote() {
    const quotes = [
      "The secret of getting ahead is getting started. – Mark Twain",
      "Do what you can, with what you have, where you are. – Theodore Roosevelt",
      "Success doesn’t come from what you do occasionally, it comes from what you do consistently. – Marie Forleo",
      "The only way to do great work is to love what you do. – Steve Jobs",
      "Your future is created by what you do today, not tomorrow. – Robert Kiyosaki",
      "Dream big. Start small. But most of all, start. – Simon Sinek",
      "Don’t watch the clock; do what it does. Keep going. – Sam Levenson",
      "Start where you are. Use what you have. Do what you can. – Arthur Ashe",
      "Action is the foundational key to all success. – Pablo Picasso",
      "Small daily improvements over time lead to stunning results. – Robin Sharma"
    ];

    const motivationalQuotes = document.getElementById("motivationalQuotes");
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    
    motivationalQuotes.textContent = quotes[randomIndex];
}
  
function removeEntry(index) {
    return function() {
        if(confirm("Are you sure you want to remove this entry?"))
        {
            timeSchedule.splice(index, 1);
            updateDatabase();
            location.reload();
        }
    }
}

function editEntry(index)
{
    toggleMenu("editEntry");

    document.getElementById("editEntrySubmit").addEventListener("click", () => {
        const startTime = document.getElementById("startTimeEdit").value;
        const endTime = document.getElementById("endTimeEdit").value;
        
        if(startTime != "" && endTime != "")
        {
            const start = {hours: parseInt(startTime.split(":")[0]), minutes: parseInt(startTime.split(":")[1])};
            const end = {hours: parseInt(endTime.split(":")[0]), minutes: parseInt(endTime.split(":")[1])};

            timeSchedule[index].start = start;
            timeSchedule[index].end = end;

            updateDatabase();
        }
        location.reload();
    }, { once: true });
}

function editEntrySubmit()
{
    startTime = document.getElementById("startTimeEdit").value;
    endTime = document.getElementById("endTimeEdit").value;
}

function loadLinksMenu()
{
    const linksMenu = document.getElementById("linksMenu");
    const image = document.getElementById('linksMenuBtnImg');

    if(linksMenu.style.display == "flex")
    {
        linksMenu.classList.add("linksMenuCloseing");
        setTimeout(() => {
            linksMenu.style.display = "none";
            linksMenu.classList.remove("linksMenuCloseing");
        }, 500);

        image.src = './img/hamburgerMenuIcon.png';
        return;
    }
    linksMenu.style.display = "flex";
    linksMenu.classList.remove("linksMenuCloseing");
    image.src = './img/XIcon.png';
}