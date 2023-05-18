import bcrypt from "bcrypt";

export default class Util {
  constructor() {
    this.statusCode = null;
    this.type = null;
    this.message = null;
    this.data = null;
  }

  setError(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
    this.type = "Error";
  }

  send(res) {
    const result = {
      statusCode: this.statusCode,
      status: this.type,
      message: this.message,
      data: this.data,
    };
    if (this.type === "success") {
      return res.status(this.statusCode).json(result);
    }
    return res.status(this.statusCode).json({
      statusCode: this.statusCode,
      status: this.type,
      message: this.message,
    });
  }

  setErrorResponse(res, message, statusCode) {
    this.setError(statusCode, message);
    return this.send(res);
  }
}
