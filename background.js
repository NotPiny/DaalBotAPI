const fs = require('fs').promises;
const path = require('path');

async function checkPasteExpires() {
    const pasteDir = await fs.readdir(path.resolve('./data/pastes'));
    const pasteFiles = pasteDir.filter(file => file.endsWith('.json'));

    let pastesChecked = 0;
    let pastesDeleted = 0;

    setInterval(async() => {
        const pasteRaw = await fs.readFile(path.resolve(`./data/pastes/${pasteFiles[pastesChecked]}`), 'utf-8');
        const pasteJSON = JSON.parse(pasteRaw);
        const pasteExpiry = pasteJSON.expiry;

        if (pasteExpiry && pasteExpiry < Date.now()) {
            await fs.unlink(path.resolve(`./data/pastes/${pasteFiles[pastesChecked]}`));
            pastesDeleted++;
        }

        pastesChecked++;

        if (pastesChecked === pasteFiles.length) {
            console.log(`[PASTE] Checked ${pastesChecked} pastes, deleted ${pastesDeleted} expired pastes.`);
            pastesChecked = 0;
            pastesDeleted = 0;

            // Stop the interval
            clearInterval(this);
        }
    }, 60 * 1000) // Check a paste every minute
}