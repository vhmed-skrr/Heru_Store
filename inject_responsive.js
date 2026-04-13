const fs = require('fs');
const path = require('path');

function processHtmlFiles(files) {
    let replacedCount = 0;
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        const inAdmin = file.includes('admin');
        const relativePath = inAdmin ? '..' : '.';

        if (!content.includes('name="viewport"')) {
            content = content.replace('<head>', '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1">');
            modified = true;
        }

        if (!content.includes('responsive.css')) {
            const linkTag = `  <link rel="stylesheet" href="${relativePath}/assets/css/responsive.css">\n`;
            content = content.replace('</head>', linkTag + '</head>');
            modified = true;
        }

        if (!content.includes('nav.js')) {
            const scriptTag = `  <script src="${relativePath}/assets/js/nav.js" defer></script>\n`;
            content = content.replace('</head>', scriptTag + '</head>');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
            replacedCount++;
            console.log('Injected tags into: ' + file);
        }
    });
    console.log('Total files modified: ' + replacedCount);
}

const rootHtmls = fs.readdirSync('./').filter(f => f.endsWith('.html'));
const adminDir = './admin';
const adminHtmls = fs.existsSync(adminDir) ? fs.readdirSync(adminDir).filter(f => f.endsWith('.html')).map(f => path.join(adminDir, f)) : [];

processHtmlFiles([...rootHtmls, ...adminHtmls]);
