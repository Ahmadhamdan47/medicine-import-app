const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserAccounts = require('../models/userAccounts');
const Roles = require('../models/roles');
const Agent = require('../models/agent');

class UserService {
  static async register(username, password, roleId) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserAccounts.create({ Username: username, PasswordHash: hashedPassword, RoleId: roleId });

  }
  

  static async login(username, password) {
    const user = await UserAccounts.findOne({ where: { Username: username } });
    if (!user) {
      throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      throw new Error('Incorrect password');
    }
    const token = jwt.sign({ id: user.UserId, roleId: user.RoleId }, 'secret', {
      expiresIn: '1h',
    });
    return { token };
  }
}

module.exports = UserService;
