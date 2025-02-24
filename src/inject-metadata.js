'use strict';

const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

const version = packageJson.version;
const revision = require('child_process').execSync('git rev-parse --short HEAD').toString().trim();
const createdAt = new Date().toLocaleString('en-UK');

const indexPath = path.join(__dirname, '../dist/scrum-poker-fire/browser/index.html');

fs.readFile(indexPath, 'utf8', (readError, data) => {
    if (readError) {
        return console.error(readError);
    }

    const metadata = `
        <meta name="version" content="${version}">
        <meta name="revision" content="${revision}">
        <meta name="created-at" content="${createdAt}">
    `;

    const result = data.replace(
        '</head>',
        `${metadata}\n</head>`,
    );

    fs.writeFile(indexPath, result, 'utf8', (writeError) => {
        if (writeError) {
            return console.error(writeError);
        };

        console.log('Metadata injected successfully!');
    });
});
