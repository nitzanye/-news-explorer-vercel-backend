const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { validateEmail } = require('../middlewares/validations');
const UnauthorizedError = require('../errors/unauthorized-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Nitzan',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validateEmail,
      message: 'Invalid Email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCrendentials = function findUserByCrendentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError('Incorrent Email, or Password'),
        );
      }
      // user found
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          // the hashes didn't match, rejecting the promise
          return Promise.reject(
            new UnauthorizedError('Incorect Email, or Password'),
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
