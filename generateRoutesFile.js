const fs = require('fs');

// Write a simple script to get the routes from the routes folder and list them in a routes.txt file
const routes = fs.readdirSync('./routes');

function addRoute(route) {
    fs.appendFileSync('./routes.txt', route + '\n');
};

routes.forEach(type => {
    let route = '';
    // The http method
    route += type.toUpperCase() + ' ';

    fs.readdirSync(`./routes/${type}`).forEach(category => {
        route += `${category}/`;

        fs.readdirSync(`./routes/${type}/${category}`).forEach(item => {
            route += `${item}`;
            addRoute(route);
        })
    });
});