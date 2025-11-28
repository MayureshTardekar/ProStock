const fs = require('fs');
const path = require('path');

console.log('📊 Starting CSV to JSON conversion (No dependencies version)...\n');

// Read the CSV file
const csvPath = path.join(__dirname, '..', 'EQUITY_L.csv');
const csvData = fs.readFileSync(csvPath, 'utf-8');

// Split into lines
const lines = csvData.split('\n');
const headers = lines[0].split(',');

console.log(`📄 Found ${lines.length - 1} lines in CSV`);
console.log(`📋 Headers: ${headers.join(', ')}\n`);

const stocks = [];
let count = 0;

// Process each line (skip header)
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const values = line.split(',');
  
  const symbol = values[0] ? values[0].trim() : '';
  const name = values[1] ? values[1].trim() : '';
  const series = values[2] ? values[2].trim() : 'EQ';
  const isin = values[6] ? values[6].trim() : '';
  const faceValue = values[7] ? parseFloat(values[7].trim()) : 10;
  
  if (symbol) {
    stocks.push({
      symbol: symbol,
      name: name,
      series: series,
      isin: isin,
      faceValue: faceValue,
      exchange: 'NSE'
    });
    
    count++;
    
    // Progress indicator
    if (count % 500 === 0) {
      console.log(`Processed: ${count} stocks...`);
    }
  }
}

console.log(`\n✅ Processed ${stocks.length} stocks from CSV`);

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('📁 Created src/data directory');
}

// Write to JSON file
const jsonPath = path.join(dataDir, 'nse_stocks.json');
fs.writeFileSync(jsonPath, JSON.stringify(stocks, null, 2));

console.log(`✅ Successfully created ${jsonPath}`);
console.log(`📊 Total stocks: ${stocks.length}`);
console.log(`\n🎉 Conversion complete!\n`);

// Show sample data
console.log('Sample data (first 5 stocks):');
console.log(JSON.stringify(stocks.slice(0, 5), null, 2));
