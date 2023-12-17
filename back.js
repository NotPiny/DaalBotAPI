require('./router.js'); // The file is now called router.js but because of pm2 it is still called back.js
require('./background.js'); // Background tasks such as checking for expired data