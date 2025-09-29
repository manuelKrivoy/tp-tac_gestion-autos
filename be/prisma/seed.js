import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

// Crea un primer admin inicial, corriendo npm run seed desde la carpeta be. Esta agregado a package.json en scripts.
const prisma = new PrismaClient();

async function main() {
  const passwordPlano = process.env.ADMIN_PASSWORD;
  const passwordHash = await bcrypt.hash(passwordPlano, 10);

  const admin = await prisma.usuario.upsert({
    where: { email: `${process.env.ADMIN_EMAIL}` },
    update: {},
    create: {
      email: `${process.env.ADMIN_EMAIL}`,
      password: passwordHash,
      rol: "ADMIN",
    },
  });

  console.log("Usuario admin creado:", admin);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
