import "dotenv/config";
import { prisma } from "../lib/db";

async function main() {
  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: { name: "Electronics", slug: "electronics" },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: "clothing" },
    update: {},
    create: { name: "Clothing", slug: "clothing" },
  });

  const accessories = await prisma.category.upsert({
    where: { slug: "accessories" },
    update: {},
    create: { name: "Accessories", slug: "accessories" },
  });

  const products = [
    {
      name: "Wireless Headphones",
      slug: "wireless-headphones",
      description: "High-quality wireless headphones with noise cancellation.",
      price: 99.99,
      stock: 25,
      categoryId: electronics.id,
    },
    {
      name: "Smart Watch",
      slug: "smart-watch",
      description: "Fitness tracker and smart notifications.",
      price: 199.99,
      stock: 15,
      categoryId: electronics.id,
    },
    {
      name: "Cotton T-Shirt",
      slug: "cotton-tshirt",
      description: "Comfortable 100% cotton t-shirt.",
      price: 24.99,
      stock: 100,
      categoryId: clothing.id,
    },
    {
      name: "Leather Wallet",
      slug: "leather-wallet",
      description: "Classic leather wallet with card slots.",
      price: 49.99,
      stock: 30,
      categoryId: accessories.id,
    },
    {
      name: "USB-C Cable",
      slug: "usb-c-cable",
      description: "Durable 2m USB-C to USB-C cable.",
      price: 12.99,
      stock: 200,
      categoryId: electronics.id,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  console.log("Seed completed:", products.length, "products created/updated");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
