require('dotenv').config();
const { Client } = require('pg');

const COUNT = 25;
const PRICE = 100000;
const CATEGORY_URL_KEY = 'bicicletas';

async function main() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await client.connect();

  let inserted = 0;
  let skipped = 0;

  try {
    const catRes = await client.query(
      'SELECT category_description_category_id AS category_id FROM category_description WHERE url_key = $1',
      [CATEGORY_URL_KEY]
    );

    if (catRes.rowCount === 0) {
      throw new Error(
        `Category with url_key='${CATEGORY_URL_KEY}' not found. Create it in admin first.`
      );
    }
    const categoryId = catRes.rows[0].category_id;

    await client.query('BEGIN');

    for (let i = 1; i <= COUNT; i += 1) {
      const name = `Bici ${i}`;
      const urlKey = `bici-${i}`;
      const sku = `BICI-${i}`;

      const productRes = await client.query(
        `INSERT INTO product (sku, price, status, visibility, type, group_id, category_id)
         VALUES ($1, $2, TRUE, TRUE, 'simple', 1, $3)
         ON CONFLICT (sku) DO NOTHING
         RETURNING product_id`,
        [sku, PRICE, categoryId]
      );

      if (productRes.rowCount === 0) {
        skipped += 1;
        continue;
      }
      const productId = productRes.rows[0].product_id;

      await client.query(
        `INSERT INTO product_description
           (product_description_product_id, name, url_key)
         VALUES ($1, $2, $3)`,
        [productId, name, urlKey]
      );

      inserted += 1;
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    await client.end();
  }

  console.log(`Inserted: ${inserted}`);
  console.log(`Skipped (already existed): ${skipped}`);
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
