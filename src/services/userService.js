const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserAccounts = require('../models/userAccounts');
const Roles = require('../models/roles');
const Agent = require('../models/agent');
const Donor = require('../models/donor');
const Recipient = require('../models/recipient');
const OTP = require('../models/otp');
const emailService = require('./emailService');
const crypto = require('crypto');
const { Op } = require('sequelize');

// Load all model associations
require('../models/associations/associations');

// OTP override for testing accounts
const SPECIAL_OTP_EMAILS = ['nizarakleh@gmail.com', 'nourine.a.fadel@gmail.com', 'oummalorg@gmail.com'];

class UserService {
  static async register(username, password, roleId, email) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await UserAccounts.create({ 
        Username: username, 
        PasswordHash: hashedPassword, 
        RoleId: roleId, 
        Email: email
      });
    } catch (error) {
      console.error("User registration error:", error); // Log complete error details
      throw error;
    }
  }
  
  

  static async login(username, password) {
    // Find the user by username
    const user = await UserAccounts.findOne({ where: { Username: username } });
    if (!user) {
        throw new Error('User not found');
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
        throw new Error('Incorrect password');
    }

    // Generate JWT token with email
    const token = jwt.sign({ id: user.UserId, roleId: user.RoleId, email: user.Email }, 'secret', {
        expiresIn: '1h',
    });

    // Fetch the role name
    const role = await Roles.findByPk(user.RoleId);

    let donorData = null; // Initialize a variable to store the donor data
    if (role.RoleName === 'Donor') {
        // Fetch donor data using DonorId
        donorData = await Donor.findOne({ where: { DonorId: user.DonorId } });
        return {
            token,
            role: role.RoleName,
            email: user.Email, // Include email in the response
            donorData
        };
    }

    // Return token, role name, email, and full donor data if available
    return {
        token,
        role: role.RoleName,
        email: user.Email, // Include email in the response
        donorData // Includes full donor data if donor, null otherwise
    };
}



static async donorSignup(donorData, username, password, roleId, email) {
  const { DonorName, DonorType, Address, PhoneNumber, Email, DonorCountry, IsActive } = donorData;
  
  const donorRole = await Roles.findOne({ where: { RoleName: 'Donor' } });
  if (!donorRole) {
    throw new Error('Role not found');
  }

  const donor = await Donor.create({
    DonorName,
    DonorType,
    Address,
    PhoneNumber,
    Email,
    DonorCountry,
    IsActive,
    CreatedDate: new Date(),
    UpdatedDate: new Date()
  });

  await this.register(username, password, donorRole.RoleId, donor.DonorId, email); // Add email parameter
}
static async recipientSignup(recipientData, username, password, email) {
  const { RecipientName, RecipientType, Address, City, Country, ContactPerson, ContactNumber, IsActive } = recipientData;
  
  const recipientRole = await Roles.findOne({ where: { RoleName: 'Recipient' } });
  if (!recipientRole) {
    throw new Error('Role not found');
  }

  const recipient = await Recipient.create({
    RecipientName,
    RecipientType,
    Address,
    City,
    Country,
    ContactPerson,
    ContactNumber,
    IsActive,
    CreatedDate: new Date(),
    UpdatedDate: new Date()
  });

  await UserAccounts.create({
    Username: username,
    PasswordHash: await bcrypt.hash(password, 10),
    RoleId: recipientRole.RoleId,
    RecipientId: recipient.RecipientId,
    Email: email // Add this line
  });
}
  static async getDonorDetailsByUserId(userId) {
    try {
      const user = await UserAccounts.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const donor = await Donor.findOne({ where: { DonorId: user.DonorId } });
      if (!donor) {
        throw new Error('Donor not found');
      }
      return donor;
    } catch (error) {
      throw new Error(`Error fetching donor details: ${error.message}`);
    }
  }

  static async getRecipientDetailsByUserId(userId) {
    try {
      const user = await UserAccounts.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const recipient = await Recipient.findOne({ where: { RecipientId: user.RecipientId } });
      if (!recipient) {
        throw new Error('Recipient not found');
      }
      return recipient;
    } catch (error) {
      throw new Error(`Error fetching recipient details: ${error.message}`);
    }
  }
  static async getDonorDetailsByUsername(username) {
    try {
      const user = await UserAccounts.findOne({ where: { Username: username } });
      if (!user) {
        throw new Error('User not found');
      }
      const donor = await Donor.findOne({ where: { DonorId: user.DonorId } });
      if (!donor) {
        throw new Error('Donor not found');
      }
      return donor;
    } catch (error) {
      throw new Error(`Error fetching donor details: ${error.message}`);
    }
  }

  static async getRecipientDetailsByUsername(username) {
    try {
      const user = await UserAccounts.findOne({ where: { Username: username } });
      if (!user) {
        throw new Error('User not found');
      }
      const recipient = await Recipient.findOne({ where: { RecipientId: user.RecipientId } });
      if (!recipient) {
        throw new Error('Recipient not found');
      }
      return recipient;
    } catch (error) {
      throw new Error(`Error fetching recipient details: ${error.message}`);
    }
  }
  static generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  static async sendOTP(email) {
    // Use fixed OTP for specified test accounts
    let otp;
    if (SPECIAL_OTP_EMAILS.includes(email)) {
      otp = '0000';
    } else {
      otp = this.generateOTP();
      // Store OTP for non-test accounts
      await OTP.create({ email, otp, expiresAt: new Date(Date.now() + 10 * 60000) });
    }
    // Send OTP via email
    await emailService.sendEmail(email, 'Your OTP Code', `Your OTP code is ${otp}`);
  }

  static async verifyOTP(email, otp) {
    // Bypass verification for specified test accounts
    if (SPECIAL_OTP_EMAILS.includes(email) && otp === '0000') {
      return true;
    }

    const record = await OTP.findOne({ where: { email, otp } });
    if (!record || record.expiresAt < new Date()) {
      throw new Error('Invalid or expired OTP');
    }
    // OTP is valid, delete the record
    await OTP.destroy({ where: { email, otp } });
    return true;
  }

  // Get user profile by ID
  static async getUserProfile(userId) {
    try {
      const user = await UserAccounts.findByPk(userId, {
        include: [
          {
            model: Roles,
            as: 'role'
          },
          {
            model: Agent,
            as: 'agent',
            required: false
          },
          {
            model: Donor,
            as: 'donor',
            required: false
          },
          {
            model: Recipient,
            as: 'recipient',
            required: false
          }
        ]
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Remove sensitive information
      const userProfile = {
        id: user.UserId,
        username: user.Username,
        email: user.Email,
        role: user.role ? user.role.RoleName : null,
        agentId: user.AgentId,
        donorId: user.DonorId,
        recipientId: user.RecipientId,
        agent: user.agent,
        donor: user.donor,
        recipient: user.recipient,
        createdDate: user.createdDate,
        lastLogin: user.lastLogin
      };

      return userProfile;
    } catch (error) {
      throw new Error(`Error fetching user profile: ${error.message}`);
    }
  }

  // Update user profile
  static async updateUserProfile(userId, updateData) {
    try {
      const user = await UserAccounts.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const updatedUser = await user.update(updateData);
      return await this.getUserProfile(userId);
    } catch (error) {
      throw new Error(`Error updating user profile: ${error.message}`);
    }
  }

  // Change user password
  static async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await UserAccounts.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.PasswordHash);
      if (!isMatch) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ PasswordHash: hashedNewPassword });

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw new Error(`Error changing password: ${error.message}`);
    }
  }

  // Get all users with filtering and pagination (admin)
  static async getAllUsers(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const whereClause = {};

      if (filters.role) {
        // Need to join with roles table for filtering
      }
      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }

      const offset = (page - 1) * limit;

      const result = await UserAccounts.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: offset,
        order: [['UserId', 'DESC']],
        include: [
          {
            model: Roles,
            as: 'role'
          }
        ],
        attributes: { exclude: ['PasswordHash'] } // Don't return password hash
      });

      return {
        users: result.rows,
        totalCount: result.count,
        currentPage: page,
        totalPages: Math.ceil(result.count / limit)
      };
    } catch (error) {
      throw new Error(`Error retrieving users: ${error.message}`);
    }
  }

  // Create new user (admin)
  static async createUser(userData, createdBy) {
    try {
      const { username, email, password, roleId, ...otherData } = userData;

      // Check if username or email already exists
      const existingUser = await UserAccounts.findOne({
        where: {
          [Op.or]: [
            { Username: username },
            { Email: email }
          ]
        }
      });

      if (existingUser) {
        throw new Error('Username or email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await UserAccounts.create({
        Username: username,
        Email: email,
        PasswordHash: hashedPassword,
        RoleId: roleId,
        ...otherData,
        createdBy
      });

      return await this.getUserProfile(newUser.UserId);
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Update user (admin)
  static async updateUser(userId, updateData, updatedBy) {
    try {
      const user = await UserAccounts.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Remove password hash from update data if present
      delete updateData.PasswordHash;

      const updatedUser = await user.update({
        ...updateData,
        updatedBy
      });

      return await this.getUserProfile(userId);
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  // Delete user (admin)
  static async deleteUser(userId) {
    try {
      const user = await UserAccounts.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      await user.destroy();
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  // Reset user password (admin)
  static async resetUserPassword(userId, newPassword) {
    try {
      const user = await UserAccounts.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ PasswordHash: hashedPassword });

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new Error(`Error resetting password: ${error.message}`);
    }
  }
}



module.exports = UserService;
