import bcrypt from "bcrypt";

const encrypt = (plainPassword) => {
  try {
    return bcrypt.hashSync(plainPassword, bcrypt.genSaltSync(10), null);
  } catch (error) {
    throw error;
  }
};
const compare = (plainPassword, encrypted) => {
  try {
    return bcrypt.compareSync(plainPassword, encrypted);
  } catch (error) {
    throw error;
  }
};

export default { encrypt, compare };
