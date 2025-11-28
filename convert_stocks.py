import csv
import json
import os

print("📊 Starting CSV to JSON conversion...\n")

stocks = []

# Read CSV file
with open('EQUITY_L.csv', 'r', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    
    count = 0
    for row in reader:
        symbol = row.get('SYMBOL', '').strip()
        if not symbol:
            continue
            
        stock = {
            'symbol': symbol,
            'name': row.get('NAME OF COMPANY', '').strip(),
            'series': row.get(' SERIES', 'EQ').strip(),
            'isin': row.get(' ISIN NUMBER', '').strip(),
            'faceValue': float(row.get(' FACE VALUE', '10').strip() or '10'),
            'exchange': 'NSE'
        }
        
        stocks.append(stock)
        count += 1
        
        if count % 500 == 0:
            print(f"Processed: {count} stocks...")

print(f"\n✅ Processed {len(stocks)} stocks from CSV")

# Create directory if needed
os.makedirs('src/data', exist_ok=True)
print("📁 Created/verified src/data directory")

# Write JSON file
with open('src/data/nse_stocks.json', 'w', encoding='utf-8') as jsonfile:
    json.dump(stocks, jsonfile, indent=2, ensure_ascii=False)

print(f"✅ Successfully created src/data/nse_stocks.json")
print(f"📊 Total stocks: {len(stocks)}")
print(f"\n🎉 Conversion complete!\n")

# Show sample
print("Sample data (first 5 stocks):")
print(json.dumps(stocks[:5], indent=2, ensure_ascii=False))
