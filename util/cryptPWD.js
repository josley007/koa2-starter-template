const bcrypt = require('bcrypt');

const saltRounds = 10;

function hashPWD(password) {
  return bcrypt.hashSync(password, saltRounds);
}

function validatePWD(plainPWD, hash) {
  return new Promise((resolve, reject) => {
    const result = bcrypt.compareSync(plainPWD, hash);
    if (result) {
      resolve();
    } else {
      reject('Invalid Password');
    }
  });
}

module.exports = {
  hashPWD,
  validatePWD,
};
