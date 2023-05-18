import crypt from "crypto";

const crypto = () => {
  try {
    let payload = "";
    crypt.randomBytes(20, (err, buffer) => {
      payload = buffer.toString("hex");
    });
    return payload;
  } catch (error) {
    throw error;
  }
};
export default { crypto };
