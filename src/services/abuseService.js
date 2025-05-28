// src/services/abuseService.js
// Simple in-memory and file-based abuse prevention for demonstration
const { AbuseToken, AbuseBlock } = require('../models/abuseToken');
const { Op } = require('sequelize');
const RATE_LIMIT = 10;

async function isBlocked(uuid) {
  const block = await AbuseBlock.findOne({ where: { uuid } });
  if (!block) return false;
  if (block.until && new Date(block.until) > new Date()) return true;
  // Unblock if expired
  await AbuseBlock.destroy({ where: { uuid } });
  return false;
}

async function blockUser(uuid, minutes = 60) {
  const prev = await AbuseBlock.findOne({ where: { uuid } });
  let increment = minutes;
  if (prev && prev.increment) increment = prev.increment * 2;
  const until = new Date(Date.now() + increment * 60 * 1000);
  await AbuseBlock.upsert({ uuid, until, increment });
}

async function flagUser(uuid, reason = 'abuse') {
  await AbuseBlock.upsert({ uuid, flagged: true, reason, until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) });
}

async function checkRateLimit(uuid, service) {
  const hour = new Date().getHours();
  let token = await AbuseToken.findOne({ where: { uuid, service, hour } });
  if (!token) {
    token = await AbuseToken.create({ uuid, service, hour, count: 1 });
  } else {
    token.count++;
    await token.save();
  }
  if (token.count > RATE_LIMIT) {
    await blockUser(uuid);
    return false;
  }
  return true;
}

async function unblockUser(uuid) {
  await AbuseBlock.destroy({ where: { uuid } });
}

async function getBlockStatus(uuid) {
  return await AbuseBlock.findOne({ where: { uuid } });
}

module.exports = {
  isBlocked,
  blockUser,
  flagUser,
  checkRateLimit,
  unblockUser,
  getBlockStatus
};
