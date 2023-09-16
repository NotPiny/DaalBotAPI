const fs = require('fs');
const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * @param {string} question 
 * @returns {Promise<string>}
*/
async function question(question) {
    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function main() {
    const dashboardRoute = (await question('Is this a dashboard route [Y/n]: ')).toUpperCase() === 'N' ? 'N' : 'Y';
    const category = await question('Category: ');
    const route = await question('Route: ');
    const verb = await question('Verb: '); // get, post, put, delete

    const verbPath = `./routes/${dashboardRoute === 'Y' ? 'dashboard/' : ''}${verb}`;
    const routePath = `./routes/${dashboardRoute === 'Y' ? 'dashboard/' : ''}${verb}/${category}`;
    const path = `./routes/${dashboardRoute === 'Y' ? 'dashboard/' : ''}${verb}/${category}/${route}.js`; // */{VERB}/{CATEGORY}/{ROUTE}.js

    if (fs.existsSync(path)) {
        console.log('Route already exists!');
        process.exit(0);
    }

    const content = `const express = require('express');
const client = require('${dashboardRoute === 'Y' ? '../../' : '../'}../../client.js');

/**
 * @param {express.Request} req
 * @param {express.Response} res
*/
module.exports = (req, res) => {
    ${dashboardRoute === 'Y' ? 'const guild = req.query.guild\n\n' : ''}
}`

    if (!fs.existsSync(verbPath)) fs.mkdirSync(verbPath);
    if (!fs.existsSync(routePath)) fs.mkdirSync(routePath);

    fs.appendFileSync(path, content);

    console.clear();
    console.log('Route generated!');
    console.log('Generating cURL command...');

    const curl = `curl -X ${verb.toUpperCase()} http://localhost:3000/${dashboardRoute === 'Y' ? 'dashboard/' : 'get/'}${category}/${route}`;

    console.log(curl);

    process.exit(0);
}

main();