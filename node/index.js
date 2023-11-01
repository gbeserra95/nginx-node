const express = require('express');
const app = express();
const port = 3000;

const config = {
    host: 'mysql',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};

const mysql = require('mysql');
const connection = mysql.createConnection(config);

const names = require('./names');

app.get('/', (req, res) => {
    const randomIndex = Math.floor(Math.random() * names.length);

    // Use a parameterized query to prevent SQL injection
    const updateQuery = 'INSERT INTO people (name) VALUES(?)';
    connection.query(updateQuery, [names[randomIndex]], (updateErr, updateResult) => {
        if (updateErr) {
            console.error('Error updating data:', updateErr);
            return res.status(500).send('Internal Server Error');
        }

        // Use a parameterized query to prevent SQL injection
        const selectQuery = 'SELECT name FROM people';
        connection.query(selectQuery, (selectErr, selectResult) => {
            if (selectErr) {
                console.error('Error selecting data:', selectErr);
                return res.status(500).send('Internal Server Error');
            }

            // Assuming selectResult is an array of objects, each containing a 'NAME' property
            const namesList = selectResult.map(element => `<li>${element.name}</li>`).join('');
            res.send(`
                <h1>Full Cycle Rocks!</h1>
                <ul>${namesList}</ul>
            `);
        });
    });
});

app.listen(port, () => {
    console.log('Running on port ' + port);
});
