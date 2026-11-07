const fs = require('fs');
const path = require('path');

const fixturePath = path.join(
  __dirname,
  '../public/organisations.json'
);

const original = JSON.parse(
  fs.readFileSync(fixturePath, 'utf8')
);

if (original.length < 8) {
  throw new Error('Original fixture records are missing.');
}

const statuses = [
  'active',
  'ACTIVE',
  'Active',
  'inactive',
  'suspended',
  'actve',
  null
];

const memberCounts = [
  0, 12, 25, 42, '18', '100', -1, null, 'invalid'
];

const emails = [
  'admin@example.com',
  'owner@company.example',
  'contact@organisation.example',
  'not-an-email',
  null,
  ''
];

const generated = Array.from({ length: 132 }, (_, index) => {
  const id = index + 1000;

  return {
    id,
    name: `Organisation ${id}`,
    status: statuses[index % statuses.length],
    memberCount: memberCounts[index % memberCounts.length],
    owner: {
      email: emails[index % emails.length]
    },
    createdAt: index % 3 === 0
      ? new Date(Date.UTC(2024, index % 12, 1)).toISOString()
      : index % 3 === 1
        ? Date.UTC(2025, index % 12, 1)
        : 'not a date'
  };
});

const finalFixture = [
  ...original.slice(0, 8),
  ...generated
];

fs.writeFileSync(
  fixturePath,
  JSON.stringify(finalFixture, null, 2)
);

console.log(`Fixture generated: ${finalFixture.length} records.`);