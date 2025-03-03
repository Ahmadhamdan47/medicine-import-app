const UserService = require('../services/userService');

class UserController {
  static async register(req, res) {
    try {
      const { username, password, roleId, email } = req.body;
      await UserService.register(username, password, roleId, email);
      res.status(201).send('User registered');
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const { token, role, donorData } = await UserService.login(username, password); // Destructure role
      res.status(200).json({ token, role, donorData }); // Include role in the response
    } catch (error) {
      res.status(401).send(error.message);
    }
  }
  
  static async donorSignup(req, res) {
    try {
      const { donorData, username, password, roleId, email } = req.body;
      await UserService.donorSignup(donorData, username, password, roleId, email);
      res.status(201).json({ message: 'Donor user registered successfully' });
    } catch (error) {
      console.error('Error registering donor user:', error);
      res.status(500).json({ error: 'An error occurred while registering the donor user' });
    }
  }
  static async recipientSignup(req, res) {
    try {
      const { recipientData, username, password, email } = req.body;
      await UserService.recipientSignup(recipientData, username, password, email);
      res.status(201).json({ message: 'Recipient user registered successfully' });
    } catch (error) {
      console.error('Error registering recipient user:', error);
      res.status(500).json({ error: 'An error occurred while registering the recipient user' });
    }
  }
  static async getDonorDetails(req, res) {
    try {
      const { userId } = req.params;
      const donorDetails = await UserService.getDonorDetailsByUserId(userId);
      res.status(200).json(donorDetails);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getRecipientDetails(req, res) {
    try {
      const { userId } = req.params;
      const recipientDetails = await UserService.getRecipientDetailsByUserId(userId);
      res.status(200).json(recipientDetails);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
  
  static async getDonorDetailsByUsername(req, res) {
    try {
      const { username } = req.params;
      const donorDetails = await UserService.getDonorDetailsByUsername(username);
      res.status(200).json(donorDetails);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getRecipientDetailsByUsername(req, res) {
    try {
      const { username } = req.params;
      const recipientDetails = await UserService.getRecipientDetailsByUsername(username);
      res.status(200).json(recipientDetails);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
  static async sendOTP(req, res) {
    try {
      const { email } = req.body;
      await UserService.sendOTP(email);
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body;
      await UserService.verifyOTP(email, otp);
      res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

}

module.exports = UserController;
