const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Add Plans
  await prisma.plan.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      type: "BUSSINESS_PLAN",
      ReqPerMonth: "100",
      ReqPerSec: "5",
    },
  });
  await prisma.plan.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      type: "ENTERPRISE_PLAN",
      ReqPerMonth: "200",
      ReqPerSec: "10",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
