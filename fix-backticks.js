const fs = require('fs');

const fixFile = (p) => {
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/\\\`/g, '`').replace(/\\\$\\{/g, '${');
  fs.writeFileSync(p, content);
};

fixFile('apps/web/src/features/conversions/pages/NewConversionPage.tsx');
fixFile('apps/web/src/features/conversions/pages/ValidationPreviewPage.tsx');
fixFile('apps/server/src/modules/conversions/conversions.controller.ts');
