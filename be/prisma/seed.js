import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

// Crea un primer admin inicial, corriendo npm run seed desde la carpeta be. Esta agregado a package.json en scripts.
const prisma = new PrismaClient();

async function main() {
  const passwordPlano = "123456"; // contraseña inicial
  const passwordHash = await bcrypt.hash(passwordPlano, 10);

  const admin = await prisma.usuario.upsert({
    where: { email: "admin@taller.com" },
    update: {},
    create: {
      email: "admin@taller.com",
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
