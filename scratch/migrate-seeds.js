const fs = require('fs');
const path = require('path');
const dbDir = path.join(__dirname, '..', 'backend', 'src', 'db');

for (const file of fs.readdirSync(dbDir)) {
  if (!file.endsWith('.js') || file === 'database.js') continue;
  let content = fs.readFileSync(path.join(dbDir, file), 'utf8');
  
  content = content.replace(/^function (\w+)\(([^)]*)\)\s*{/gm, 'async function $1($2) {');
  content = content.replace(/(?<!await\s+)(db\.prepare\([\s\S]*?\)\.(run|all|get)\([\s\S]*?\))/g, 'await $1');
  
  // Custom replaces
  content = content.replace(/hasRows\("users"\)/g, 'await hasRows("users")');
  content = content.replace(/hasRows\("volunteers"\)/g, 'await hasRows("volunteers")');
  content = content.replace(/hasRows\("resources"\)/g, 'await hasRows("resources")');
  content = content.replace(/hasRows\("incidents"\)/g, 'await hasRows("incidents")');
  content = content.replace(/hasRows\("bulletins"\)/g, 'await hasRows("bulletins")');
  content = content.replace(/hasRows\("intel_pins"\)/g, 'await hasRows("intel_pins")');
  content = content.replace(/hasRows\("heartbeats"\)/g, 'await hasRows("heartbeats")');
  content = content.replace(/hasRows\("rainfall_logs"\)/g, 'await hasRows("rainfall_logs")');
  content = content.replace(/hasRows\("equipment"\)/g, 'await hasRows("equipment")');
  content = content.replace(/hasRows\("offline_guides"\)/g, 'await hasRows("offline_guides")');

  content = content.replace(/runMigrations\(\)/g, 'await runMigrations()');
  content = content.replace(/seedUsers\(\)/g, 'await seedUsers()');
  content = content.replace(/seedVolunteers\(\)/g, 'await seedVolunteers()');
  content = content.replace(/seedResources\(\)/g, 'await seedResources()');
  content = content.replace(/seedIncidentsAndTasks\(\)/g, 'await seedIncidentsAndTasks()');
  content = content.replace(/seedBulletins\(\)/g, 'await seedBulletins()');
  content = content.replace(/seedIntelPins\(\)/g, 'await seedIntelPins()');
  content = content.replace(/seedHeartbeats\(\)/g, 'await seedHeartbeats()');
  content = content.replace(/seedRainfall\(\)/g, 'await seedRainfall()');
  content = content.replace(/seedEquipment\(\)/g, 'await seedEquipment()');
  content = content.replace(/seedGuides\(\)/g, 'await seedGuides()');
  
  content = content.replace(/insert\.run\(/g, 'await insert.run(');
  
  fs.writeFileSync(path.join(dbDir, file), content);
}
