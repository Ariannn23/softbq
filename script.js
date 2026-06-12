const { sqlite } = require('./packages/db/dist/index.js'); sqlite.exec('INSERT OR IGNORE INTO settings (key, value) VALUES (''min_version_required'', ''0.1.0'')');  
