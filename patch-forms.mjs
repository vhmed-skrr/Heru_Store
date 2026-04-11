import fs from 'fs';

const files = ['checkout.html', 'suggest.html'];

for (let file of files) {
   if (!fs.existsSync(file)) continue;
   let content = fs.readFileSync(file, 'utf8');

   content = content.replace(/<label class="form-label">(.*?)<\/label>\s*<(input|select|textarea)([^>]+id="([^"]+)"[^>]*)>/gis, (match, labelContent, tag, tagRest, id) => {
       
       let newLabel = `<label class="form-label" for="${id}">${labelContent}</label>`;
       let newTag = `<${tag}${tagRest}>`;
       
       if (newTag.includes('required') && !newTag.includes('aria-required')) {
           newTag = newTag.replace(new RegExp(`<${tag}`), `<${tag} aria-required="true"`);
       }
       if (!newTag.includes('aria-describedby')) {
           newTag = newTag.replace(new RegExp(`<${tag}`), `<${tag} aria-describedby="${id}-error"`);
       }
       
       return `${newLabel}\n                          ${newTag}`;
   });

   content = content.replace(/class="form-error-message" id="([^"]+)"/g, 'class="form-error-message" id="$1" role="alert" aria-live="assertive"');

   fs.writeFileSync(file, content, 'utf8');
}
console.log('Forms patched.');
