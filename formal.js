var stateMonth;
var stateYear = 0;

function generateTable(data, month, year) {
    const headers = ['Date', 'Start Time', 'End Time', 'Duration'];

    const currentMonth = month + 1;

    // Create table and header row
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    // Add data rows
    data.forEach(({ date, start, end }) => {
        const rowDate = new Date(date);
        if ((rowDate.getMonth() + 1 !== currentMonth) || (rowDate.getFullYear()) !== year) return;

        const row = document.createElement('tr');
        const cells = [
            rowDate.toISOString().split('T')[0], // Format date
            `${start.hours}:${start.minutes.toString().padStart(2, '0')}`, // Start time
            `${end.hours}:${end.minutes.toString().padStart(2, '0')}`, // End time
            calculateDuration(start, end), // Duration
        ];

        cells.forEach(text => {
            const cell = document.createElement('td');
            cell.textContent = text;
            row.appendChild(cell);
        });

        table.appendChild(row);
    });

    return table;
}

function calculateDuration(start, end) {
    const startMinutes = start.hours * 60 + start.minutes;
    const endMinutes = end.hours * 60 + end.minutes;
    const durationMinutes = endMinutes - startMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function generateSummaryTable(data, month, year) {
    const currentMonth = month + 1;

    let totalDurations = 0;
    let totalEntries = 0;
    let totalRevenue = 0;

    // Calculate total durations, revenue, and count valid entries
    data.forEach(({ date, start, end, hourlyRate }) => {
        const rowDate = new Date(date);
        if ((rowDate.getMonth() + 1 !== currentMonth) || (rowDate.getFullYear()) !== year) return;

        const startMinutes = start.hours * 60 + start.minutes;
        const endMinutes = end.hours * 60 + end.minutes;
        const durationMinutes = endMinutes - startMinutes;

        totalDurations += durationMinutes;
        totalRevenue += (durationMinutes / 60) * info.hourlyRate; // Calculate revenue
        totalEntries++;
    });

    const table = document.createElement('table');

    // Create the header row
    const headerRow = document.createElement('tr');
    const header = document.createElement('th');
    header.colSpan = 2; // Span two columns for a unified header
    header.textContent = 'Summary';
    headerRow.appendChild(header);
    table.appendChild(headerRow);

    // General row
    const generalRow = document.createElement('tr');
    const generalHeader = document.createElement('th');
    generalHeader.textContent = 'General';
    const generalCell = document.createElement('td');
    generalCell.textContent = `Work Days: ${totalEntries}, Total hours: ${Math.floor(totalDurations / 60)}:${(totalDurations % 60).toString().padStart(2, '0')}`;
    generalRow.appendChild(generalHeader);
    generalRow.appendChild(generalCell);
    table.appendChild(generalRow);

    // Statistics row
    const statisticsRow = document.createElement('tr');
    const statisticsHeader = document.createElement('th');
    statisticsHeader.textContent = 'Statistics';
    const statisticsCell = document.createElement('td');
    const avgMinutes = totalEntries > 0 ? totalDurations / totalEntries : 0;
    statisticsCell.textContent = `Average duration: ${formatDuration(avgMinutes)}`;
    statisticsRow.appendChild(statisticsHeader);
    statisticsRow.appendChild(statisticsCell);
    table.appendChild(statisticsRow);

    // Total Revenue row
    const revenueRow = document.createElement('tr');
    const revenueHeader = document.createElement('th');
    revenueHeader.textContent = 'Total Revenue';
    const revenueCell = document.createElement('td');
    revenueCell.textContent = `${totalRevenue.toFixed(2)}₪`;
    revenueRow.appendChild(revenueHeader);
    revenueRow.appendChild(revenueCell);
    table.appendChild(revenueRow);

    return table;
}

// Helper function to format duration in "hours:minutes" format
function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}:${mins.toString().padStart(2, '0')}`;
}

function writeTitle(month, year)
{
    var months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];
    const name =  document.getElementById('name');
    const workplace = document.getElementById('workplace');
    const monthDisplay = document.getElementById('month');

    name.textContent = "Worker Name: " + info.name;
    workplace.textContent = "Workplace: " + info.workplace;

    monthDisplay.textContent = "Date: " + months[month] + " " + year;
}

function previousBtn()
{
    if(stateMonth != 0)
    {
        stateMonth -= 1;
    }
    else
    {
        stateYear -= 1;
        stateMonth = 11;
    }
    functionsCaller(stateMonth, stateYear);
}

function nextBtn()
{
    if(stateMonth != 11)
    {
        stateMonth += 1;
    }
    else
    {
        stateYear += 1;
        stateMonth = 0;
    }
    functionsCaller(stateMonth, stateYear);
}

function functionsCaller(month, year)
{
    // Get the container element to display the table
    const container = document.getElementById('tableContainer');

    container.innerHTML = "";

    var data = [];

    for (var i = 0; i < timeSchedule.length; i++)
    {
        var entry = timeSchedule[i];

        if(entry.end.hours != 0 && entry.end.minutes != 0)
        {
            data.push(entry);
        }
    }

    // Generate the table and append it to the container
    container.appendChild(generateTable(data, month, year));

    writeTitle(month, year);

    container.appendChild(generateSummaryTable(data.reverse(), month, year));
}

const currentDate = new Date();
stateYear = currentDate.getFullYear();
stateMonth = currentDate.getMonth();

functionsCaller(stateMonth, stateYear);