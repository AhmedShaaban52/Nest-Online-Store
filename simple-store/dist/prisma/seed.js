"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
require("dotenv/config");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in the environment.');
}
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('Seeding products with images...');
    await prisma.product.deleteMany({});
    const products = [
        {
            name: 'Wireless Noise-Canceling Headphones',
            price: 199.99,
            stock: 15,
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
        },
        {
            name: 'Mechanical Gaming Keyboard',
            price: 89.99,
            stock: 25,
            imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60',
        },
        {
            name: 'Ergonomic Office Chair',
            price: 349.50,
            stock: 8,
            imageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=500&auto=format&fit=crop&q=60',
        },
        {
            name: '4K Ultra HD Smart Monitor 32"',
            price: 449.99,
            stock: 12,
            imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60',
        },
        {
            name: 'USB-C Multi-Port Adapter Hub',
            price: 39.95,
            stock: 50,
            imageUrl: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=500&auto=format&fit=crop&q=60',
        },
        {
            name: 'Portable Bluetooth Waterproof Speaker',
            price: 59.99,
            stock: 30,
            imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60',
        },
    ];
    for (const product of products) {
        const created = await prisma.product.create({
            data: product,
        });
        console.log(`Created product: ${created.name} (Stock: ${created.stock})`);
    }
    console.log('Seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    pool.end();
});
//# sourceMappingURL=seed.js.map