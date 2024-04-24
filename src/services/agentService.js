const Agent = require("../models/agent");

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

module.exports = { addAgent, editAgent, deleteAgent, getAllAgents };
