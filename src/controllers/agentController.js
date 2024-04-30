const agentService = require("../services/agentService");

// existing controllers...

const addAgent = async (req, res) => {
  try {
    const agent = await agentService.addAgent(req.body);
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const editAgent = async (req, res) => {
  try {
    const agent = await agentService.editAgent(req.params.agentId, req.body);
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const deleteAgent = async (req, res) => {
  try {
    await agentService.deleteAgent(req.params.agentId);
    res.json({ message: "Agent deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const getAllAgents = async (req, res) => {
  try {
    const agents = await agentService.getAllAgents();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

module.exports = { addAgent, editAgent, deleteAgent, getAllAgents };
