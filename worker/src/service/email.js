const { prisma } = require("../helpers/prismaClient");

class Email {
  static async createEmail(data) {
    try {
      return await prisma.email.create({
        data: data,
      });
    } catch (error) {
      throw error;
    }
  }
  static async updateEmail(emailId, status) {
    try {
      return await prisma.email.update({
        where: { id: emailId },
        data: {
          status: status,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  static async getAllEmail() {
    try {
      return await prisma.email.findMany({
        where: { status: "FAILED" },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Email;
