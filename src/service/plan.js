const { prisma } = require("../helpers/prismaClient");

class Plan {
  static async getPlanById(planId) {
    try {
      return await prisma.plan.findUnique({
        where: {
          id: planId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Plan;
