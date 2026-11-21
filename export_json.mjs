
import { INITIAL_DATA } from './src/data/initialData.js';
import fs from 'fs';
fs.writeFileSync('C:/Users/HP/.gemini/antigravity/scratch/initial_data.json', JSON.stringify(INITIAL_DATA, null, 2));
console.log('Exported initial data JSON');
