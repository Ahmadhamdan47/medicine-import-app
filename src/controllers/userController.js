const UserService = require('../services/userService');

class UserController {
  static async register(req, res) {
    try {
      const { username, password, roleId } = req.body;
      await UserService.register(username, password, roleId);
      res.status(201).send('User registered');
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const { token } = await UserService.login(username, password);
      res.status(200).json({ token });
    } catch (error) {
      res.status(401).send(error.message);
    }
  }
}

module.exports = UserController;
