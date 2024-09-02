const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserAccounts = require('../models/userAccounts');
const Roles = require('../models/roles');
const Agent = require('../models/agent');
const Donor = require('../models/donor');

class UserService {
  static async register(username, password, roleId, donorId) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserAccounts.create({ Username: username, PasswordHash: hashedPassword, RoleId: roleId, DonorId: donorId 
    });

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

    // Generate JWT token
    const token = jwt.sign({ id: user.UserId, roleId: user.RoleId }, 'secret', {
        expiresIn: '1h',
    });

    // Fetch the role name
    const role = await Roles.findByPk(user.RoleId);

    let donorData = null; // Initialize a variable to store the donor data
    if (user.RoleId === 0) {
        // Fetch donor data using DonorId
        donorData = await Donor.findOne({ where: { DonorId: user.DonorId } });
        return{
          token,
          role: role.RoleName,
          donorData
        };
    }
else
    // Return token, role name, and full donor data if available
    return { 
        token, 
        role: role.RoleName, 
        donorData// Includes full donor data if donor, null otherwise
    };
}



  static async donorSignup(donorData, username, password) {
    const { DonorName, DonorType, Address, PhoneNumber, Email, DonorCountry, IsActive } = donorData;
    
    // Fetch the RoleId for Donor
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

    await this.register(username, password, donorRole.RoleId, donor.DonorId);
  }
}



module.exports = UserService;
