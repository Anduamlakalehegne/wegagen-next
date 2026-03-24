const fs = require('fs');

const pathStr = 'd:\\Wegagen Website Production3\\src\\Components\\Pages\\Personal Banking\\Personal_Banking.jsx';
const content = fs.readFileSync(pathStr, 'utf8');

const blocks = content.split('{dispaly ==');
const accounts = [];

for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    
    // get ID
    const match = block.match(/^\s*(\d+)/);
    if (!match) continue;
    const id = parseInt(match[1]);

    // get title
    let title = "";
    const titleMatch = block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
    if (titleMatch) {
        title = titleMatch[1].replace(/<br\s*\/?>/g, ' ').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }

    // get desc
    let desc = "";
    const descMatch = block.match(/<p[^>]*className="text-white max-w-[^"]*"[^>]*>([\s\S]*?)<\/p>/);
    if (descMatch) {
        desc = descMatch[1].replace(/\s+/g, ' ').trim();
    }

    // get arrays
    // We look for everything between {[ and ]}
    // and extract the strings using regex
    const arraysMatch = [...block.matchAll(/\{\[([\s\S]*?)\]\.map/g)];
    const parsedArrays = arraysMatch.map(m => {
        const bracketContent = m[1];
        // extract all strings from this content
        const strMatches = [...bracketContent.matchAll(/(["'])((?:(?=(\\?))\3[\s\S])*?)\1/g)];
        return strMatches.map(sm => sm[2].replace(/\\"/g, '"').replace(/\\'/g, "'"));
    });

    const isFcySaving = (id === 20); // 20 has different format
    const isEcx = (id === 15); // 15 has diff format

    accounts.push({
        id,
        title,
        description: desc,
        features: parsedArrays[0] || [],
        requirements: parsedArrays[1] || [],
    });
}

// Convert to module.exports
const jsCode = `// Generated Personal Banking Data
export const ACCOUNT_TYPES = ` + JSON.stringify(accounts, null, 2) + `;\n`;

fs.writeFileSync('src/data/personal-banking.js', jsCode, 'utf8');
console.log('Successfully wrote src/data/personal-banking.js with ' + accounts.length + ' accounts.');
