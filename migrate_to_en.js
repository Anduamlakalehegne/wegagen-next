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

    const arraysMatch = [...block.matchAll(/\{\[([\s\S]*?)\]\.map/g)];
    const parsedArrays = arraysMatch.map(m => {
        const bracketContent = m[1];
        const strMatches = [...bracketContent.matchAll(/(["'])((?:(?=(\\?))\3[\s\S])*?)\1/g)];
        return strMatches.map(sm => sm[2].replace(/\\"/g, '"').replace(/\\'/g, "'"));
    });

    accounts.push({
        id,
        title,
        description: desc,
        features: parsedArrays[0] || [],
        requirements: parsedArrays[1] || [],
    });
}

const staticStrings = {
  premiumBankingServices: "Premium Banking Services",
  tailoredFinancialSolutions: "Tailored financial solutions designed to empower your future and secure your legacy since 1997.",
  browseAccounts: "Browse Accounts",
  quickNavigate: "Quick Navigate",
  accountDirectory: "Account Directory",
  keyFeatures: "Key Features",
  benefitsOfAccount: "Benefits of this account",
  basicRequirements: "Basic Requirements",
  toGetProduct: "To get the product",
  personalBankingTitle: "Personal Banking",
};

const personalBankingSection = {
  ...staticStrings,
  accounts: accounts,
};

const enJsPath = './src/lib/i18n/messages/en.js';
let enJsContent = fs.readFileSync(enJsPath, 'utf8');

if (enJsContent.includes('personalBanking:')) {
  console.log('Already has personalBanking key. Please remove it manually first if you want to regenerate.');
} else {
  const lastBraceIndex = enJsContent.lastIndexOf('}');
  if(lastBraceIndex > 0) {
    enJsContent = enJsContent.substring(0, lastBraceIndex) + `, \n  personalBanking: ` + JSON.stringify(personalBankingSection, null, 2) + `\n};\n`;
    fs.writeFileSync(enJsPath, enJsContent, 'utf8');
    console.log('Successfully added personalBanking to en.js');
  } else {
    console.log('failed to find bounding brace');
  }
}
