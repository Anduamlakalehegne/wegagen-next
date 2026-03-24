const fs = require('fs');
const content = fs.readFileSync('d:/Wegagen Website Production3/src/Components/Pages/Personal Banking/Personal_Banking.jsx', 'utf8');
const blocks = content.split('dispaly ==');

let output = "";
const analyze = [10, 15, 18, 19, 20, 21];
analyze.forEach((t) => {
    const block = blocks.find(b => b.trim().startsWith(t + ' '));
    if (block) {
        output += '\n--- TAB ' + t + ' ---\n';
        output += 'H3s: ' + Array.from(block.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)).map(m=>m[1].replace(/<[^>]*>/g,'').trim()).join(', ') + '\n';
        output += 'H4s: ' + Array.from(block.matchAll(/<h4[^>]*>([\s\S]*?)<\/h4>/g)).map(m=>m[1].replace(/<[^>]*>/g,'').trim()).join(', ') + '\n';
        output += 'Lists: ' + (block.includes('i.') ? 'Has Roman' : 'No Roman') + '\n';
    }
});
fs.writeFileSync('analyze_output2.txt', output, 'utf8');
