import fs from 'fs';

// Function to parse CSV data
function parseCSV(csvData) {
    const lines = csvData.split('\n');
    const result = [];

    // Parsing each row
    for (let i = 0; i < lines.length; i++) {
        const row = [];
        let insideQuotes = false;
        let currentValue = '';

        for (let j = 0; j < lines[i].length; j++) {
            const char = lines[i][j];

            if (char === ',' && !insideQuotes) {
                row.push(currentValue.trim());
                currentValue = '';
            } else if (char === '"' && lines[i][j + 1] === '"') {
                currentValue += '"';
                j++;
            } else if (char === '"') {
                insideQuotes = !insideQuotes;
            } else {
                currentValue += char;
            }
        }

        if (currentValue !== '') {
            row.push(currentValue.trim());
        }

        result.push(row);
    }

    return result;
}

// Reading CSV file
fs.readFile('AWL.csv', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    const parsedData = parseCSV(data);
    fs.writeFile('AWL.sql', createSQL(parsedData), 'utf8', (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return;
        }
        console.log("Parsed data has been written to AWL.sql");
    });
});

function list(list) {
    if (!list) {
        return 'NULL';
    }
    const words = list.trim().replace(/\s/g, "").split(',');
    return `'{${words.map(l => `"${l}"`).join(',')}}'`;
}

function createSQL(data) {
    console.log(data);
    const start = 'INSERT INTO awl (headword, sublist, related_word_forms) VALUES';
    let values = data
        .filter(data => !!data[0] && !!data[1])
        .map(data => `('${data[0]}', ${data[1]}, ` + list(data[2]) + ')');
    return start + '\n' + values.join(',\n');
}