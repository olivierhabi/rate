const { prisma } = require("../helpers/prismaClient");

class SMS {
  static async createSMS(data) {
    try {
      return await prisma.sms.create({
        data: data,
      });
    } catch (error) {
      throw error;
    }
  }
  static async updateSMS(smsId, status) {
    try {
      return await prisma.sms.update({
        where: { id: smsId },
        data: {
          status: status,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  static async getAllSMS() {
    try {
      return await prisma.sms.findMany({
        where: { status: "FAILED" },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SMS;
