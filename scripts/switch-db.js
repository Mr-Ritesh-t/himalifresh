const fs = require('fs');
const path = require('path');

const target = process.argv[2]; // 'postgres' or 'sqlite'
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

if (!target || !['postgres', 'postgresql', 'sqlite'].includes(target.toLowerCase())) {
  console.log('Usage: node scripts/switch-db.js [postgres|sqlite]');
  process.exit(1);
}

let content = fs.readFileSync(schemaPath, 'utf8');

if (target.toLowerCase() === 'sqlite') {
  content = content.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  fs.writeFileSync(schemaPath, content, 'utf8');
  console.log('Switched prisma/schema.prisma to: provider = "sqlite"');
} else {
  content = content.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  fs.writeFileSync(schemaPath, content, 'utf8');
  console.log('Switched prisma/schema.prisma to: provider = "postgresql"');
}
