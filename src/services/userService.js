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

    // If the role is donor (RoleId = 0), find the donor data
   

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
    let IsActive = null; // Initialize a variable to store the donor's IsActive status
    if (user.RoleId === 0) {
        const donorData = await Donor.findOne({ where: { DonorId: user.DonorId } }); // Fetch donor data using DonorId
        if (donorData) {
            IsActive = donorData.IsActive; // Set the IsActive status
        }
    }
    console.log(IsActive);
    // Return token, role name, and IsActive status if available
    return { token, role: role.RoleName, IsActive }; 
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
