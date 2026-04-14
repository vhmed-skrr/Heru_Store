import fs from 'fs';
import path from 'path';

function fixPaths(dir, depth = 0) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== '.git' && file !== 'node_modules' && file !== 'assets') {
                fixPaths(fullPath, depth + 1);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let prefix = depth === 0 ? './' : '../'.repeat(depth);
            
            // Fix href='/assets and src='/assets
            content = content.replace(/href=\"\/assets\//g, 'href=\"' + prefix + 'assets/');
            content = content.replace(/src=\"\/assets\//g, 'src=\"' + prefix + 'assets/');
            
            // Fix href="/something" navigation links explicitly to prefix
            // skip external domains 
            // skip absolute root fallback if needed? actually just standard navigation like href="/cart" -> href="./cart.html" could be tricky.
            // Just focus on /assets to fix styles, images and scripts.
            content = content.replace(/href=\"\/(?!https?:\/\/)([^"]*)\"/g, 'href=\"' + prefix + '$1\"');
            content = content.replace(/src=\"\/(?!https?:\/\/)([^"]*)\"/g, 'src=\"' + prefix + '$1\"');
            
            fs.writeFileSync(fullPath, content);
            console.log('Fixed:', fullPath);
        }
    }
}

fixPaths('.');
