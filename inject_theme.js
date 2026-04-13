const fs = require('fs');
const path = require('path');

function processPublicHtmlFiles(files) {
    let replacedCount = 0;
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        const relativePath = '.';

        // 1. Inject themes.css after responsive.css or tokens.css
        if (!content.includes('themes.css')) {
            const linkTag = `  <link rel="stylesheet" href="${relativePath}/assets/css/themes.css">\n`;
            content = content.replace('</head>', linkTag + '</head>');
            modified = true;
        }

        // 2. Inject theme.js
        if (!content.includes('theme.js')) {
            const scriptTag = `  <script src="${relativePath}/assets/js/theme.js" defer></script>\n`;
            content = content.replace('</head>', scriptTag + '</head>');
            modified = true;
        }

        // 3. Inject toggle button before mobile-menu-toggle
        if (!content.includes('theme-toggle') && content.includes('class="mobile-menu-toggle"')) {
            const btnHtml = `<button class="theme-toggle btn-ghost" aria-label="تغيير المظهر" style="font-size: var(--text-xl);">☀️</button>\n              `;
            content = content.replace('<button class="mobile-menu-toggle"', btnHtml + '<button class="mobile-menu-toggle"');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
            replacedCount++;
            console.log('Injected theme into: ' + file);
        }
    });
    console.log('Total public files modified: ' + replacedCount);
}

// Front facing files:
const rootHtmls = fs.readdirSync('./').filter(f => f.endsWith('.html'));
processPublicHtmlFiles(rootHtmls);

// Hardcoded fixes
function replaceInFile(file, searchStr, replaceStr) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes(searchStr)) {
        fs.writeFileSync(file, content.replace(searchStr, replaceStr), 'utf8');
        console.log('Fixed hardcode in: ' + file);
    }
}

replaceInFile('index.html', 'background-color: #060606;', 'background-color: var(--bg-secondary);');
replaceInFile('admin/login.html', 'background-color: #050505;', 'background-color: var(--bg-primary);');
replaceInFile('admin/index.html', 'background-color: #030303;', 'background-color: var(--bg-primary);');
replaceInFile('assets/css/components.css', 'background-color: #111;', 'background-color: var(--bg-secondary);');
