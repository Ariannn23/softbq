import { db } from './src';
import { sql } from 'drizzle-orm';

async function run() {
  console.log('Migrating...');
  try {
    await db.run(sql`ALTER TABLE clients ADD COLUMN has_plame INTEGER DEFAULT 0 NOT NULL`);
    console.log('has_plame added');
  } catch (e: any) {
    console.log('has_plame maybe exists:', e.message);
  }
  
  try {
    await db.run(sql`ALTER TABLE clients ADD COLUMN sales_account TEXT DEFAULT '' NOT NULL`);
    console.log('sales_account added');
  } catch (e: any) {
    console.log('sales_account maybe exists:', e.message);
  }
  
  try {
    await db.run(sql`ALTER TABLE clients ADD COLUMN purchases_account TEXT DEFAULT '' NOT NULL`);
    console.log('purchases_account added');
  } catch (e: any) {
    console.log('purchases_account maybe exists:', e.message);
  }
  
  console.log('Done!');
}
run();
