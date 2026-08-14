const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '..', 'backend', 'src', 'models');

function processModels() {
  const files = fs.readdirSync(modelsDir);
  for (const file of files) {
    if (!file.endsWith('.js')) continue;
    let content = fs.readFileSync(path.join(modelsDir, file), 'utf8');
    
    // Replace `function someName(` with `async function someName(`
    content = content.replace(/^function (\w+)\(([^)]*)\)\s*{/gm, (match, name, args) => {
      return `async function ${name}(${args}) {`;
    });
    
    // Add await to db.prepare().run/all/get if not already awaited
    content = content.replace(/(?<!await\s+)(db\.prepare\([\s\S]*?\)\.(run|all|get)\([\s\S]*?\))/g, 'await $1');

    // Custom fix for heartbeatModel internal call
    content = content.replace(/const user = getUserAgency\(userId\);/g, 'const user = await getUserAgency(userId);');
    
    fs.writeFileSync(path.join(modelsDir, file), content);
    console.log(`Processed model: ${file}`);
  }
}

processModels();
