const Agent = require("../models/agent");
const bcrypt = require('bcrypt');
const UserAccounts = require("../models/userAccounts");
const multer = require('multer');
const path = require('path');
const addAgent = async (agentData) => {
  try {
    const agent = await Agent.create(agentData);
    return agent;
  } catch (error) {
    console.error(error);
    throw new Error("Error in agentService: " + error.message);
  }
};

const editAgent = async (agentId, agentData) => {
  try {
    const agent = await Agent.update(agentData, {
      where: { AgentID: agentId },
    });
    return agent;
  } catch (error) {
    console.error(error);
    throw new Error("Error in agentService: " + error.message);
  }
};

const deleteAgent = async (agentId) => {
  try {
    await Agent.destroy({
      where: { AgentID: agentId },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error in agentService: " + error.message);
  }
};

const getAllAgents = async () => {
  try {
    const agents = await Agent.findAll();
    return agents;
  } catch (error) {
    console.error(error);
    throw new Error("Error in agentService: " + error.message);
  }
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext); // Use unique file name
  }
});

const upload = multer({ storage: storage });
const registerAgent = async (req,username, password, agentData, signature) => {
  try {
    // Handle file upload
    const uploadPromise = new Promise((resolve, reject) => {
      upload.single('signature')(req, {}, (err) => {
        if (err) {
          console.error('File upload error:', err);
          reject(err);
        } else resolve();
      });
    });

    await uploadPromise;

    // Include the e-signature in agentData
    agentData.agentData.esignature = req.file ? req.file.path : null;

    // Create a new agent with the e-signature included in agentData
    const agent = await Agent.create(agentData.agentData).catch(err => {
      console.error('Agent creation error:', err);
      throw err;
    });
    console.log(agent);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10).catch(err => {
      console.error('Password hashing error:', err);
      throw err;
    });

    // Create a new user account with the agent's ID and roleId as 2
    await UserAccounts.create({ Username: username, PasswordHash: hashedPassword, RoleId: 2, AgentId: agent.AgentID }).catch(err => {
      console.error('User account creation error:', err);
      throw err;
    });

    return agent;
  } catch (error) {
    console.error('Agent registration failed:', error);
    throw new Error('Agent registration failed. Please try again.');
  }
};

module.exports = { addAgent, editAgent, deleteAgent, getAllAgents, registerAgent};
