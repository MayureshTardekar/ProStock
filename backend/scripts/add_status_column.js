const pool = require('../config/database');

async function migrate() {
  try {
    console.log('Checking orders table schema...');
    
    // Check if status column exists
    const [columns] = await pool.query(`SHOW COLUMNS FROM orders LIKE 'status'`);
    
    if (columns.length === 0) {
      console.log('Adding status column to orders table...');
      await pool.query(`
        ALTER TABLE orders 
        ADD COLUMN status ENUM('COMPLETED','PENDING','CANCELLED') DEFAULT 'COMPLETED'
      `);
      console.log('Successfully added status column.');
    } else {
      console.log('Status column already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
