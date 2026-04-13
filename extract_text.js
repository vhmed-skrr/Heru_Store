const fs = require('fs');

const extractText = (htmlFile) => {
    try {
        const text = fs.readFileSync(htmlFile, 'utf8');
        console.log('--- ' + htmlFile + ' ---');
        const matches = text.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/g) || [];
        const labels = text.match(/<label[^>]*>(.*?)<\/label>/g) || [];
        const buttons = text.match(/<button[^>]*>(.*?)<\/button>/g) || [];
        const placeholders = text.match(/placeholder="(.*?)"/g) || [];
        console.log(JSON.stringify({ matches: matches.slice(0, 10), labels: labels.slice(0, 10), buttons: buttons.slice(0, 10), placeholders: placeholders.slice(0,10) }));
    } catch(e) { console.log(e.message); }
}

extractText('checkout.html');
extractText('track-order.html');
extractText('suggest.html');
