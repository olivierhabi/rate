const { prisma } = require("../helpers/prismaClient");

class User {
  static async createUser(data) {
    try {
      return await prisma.user.create({
        data: data,
      });
    } catch (error) {
      throw error;
    }
  }
  static async getUserByEmail(email) {
    try {
      return await prisma.user.findUnique({
        where: {
          email: email,
        },
        include: {
          Plan: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async upgradeUserPlan(userId, planId) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: {
          planId: planId,
        },
        include: {
          Plan: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
