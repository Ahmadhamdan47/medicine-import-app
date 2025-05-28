// src/middlewares/abuseMiddleware.js
const AbuseToken = require('../models/abuseToken');
const AbuseBlock = require('../models/abuseBlock');
const { Op } = require('sequelize');

const LIMIT_PER_HOUR = 10;
const BASE_BLOCK_MINUTES = 10;

async function isBlockedDB(uuid) {
  const block = await AbuseBlock.findOne({ where: { uuid } });
  if (!block) return false;
  if (block.until && new Date(block.until) > new Date()) return true;
  // Unblock if expired
  await AbuseBlock.destroy({ where: { uuid } });
  return false;
}

function abuseMiddleware(serviceName) {
  return async (req, res, next) => {
    const uuid = req.body.uuid || req.query.uuid || req.headers['x-uuid'];
    if (!uuid) return res.status(400).json({ error: 'UUID is required for abuse protection.' });
    if (await isBlockedDB(uuid)) {
      return res.status(429).json({ error: 'Too many requests. User is temporarily blocked due to abuse.' });
    }
    const hour = new Date().getHours();
    let token = await AbuseToken.findOne({ where: { uuid, service: serviceName, hour } });
    if (!token) {
      token = await AbuseToken.create({ uuid, service: serviceName, hour, count: 1, updatedAt: new Date() });
    } else {
      token.count++;
      token.updatedAt = new Date();
      await token.save();
    }
    if (token.count > LIMIT_PER_HOUR) {
      // Block user for incrementally longer time
      let block = await AbuseBlock.findOne({ where: { uuid } });
      let prevIncrement = block?.increment || BASE_BLOCK_MINUTES;
      let increment = prevIncrement * 2;
      let until = new Date(Date.now() + increment * 60 * 1000);
      if (!block) {
        await AbuseBlock.create({ uuid, until, increment });
      } else {
        block.until = until;
        block.increment = increment;
        await block.save();
      }
      return res.status(429).json({ error: `Too many requests. User is blocked for ${increment} minutes.` });
    }
    next();
  };
}

async function flagUser(uuid, reason = 'abuse') {
  await AbuseBlock.upsert({ uuid, flagged: true, reason, until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), increment: 99, updatedAt: new Date() });
}
async function unblockUser(uuid) {
  await AbuseBlock.destroy({ where: { uuid } });
}
async function getBlockStatus(uuid) {
  return await AbuseBlock.findOne({ where: { uuid } });
}

module.exports = {
  abuseMiddleware,
  flagUser,
  unblockUser,
  getBlockStatus
};
