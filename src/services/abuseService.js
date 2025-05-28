// src/services/abuseService.js
// Simple in-memory and file-based abuse prevention for demonstration
const fs = require('fs');
const path = require('path');

const RATE_LIMIT = 10; // max requests per hour per service per uuid
const BLOCK_FILE = path.join(__dirname, '../data/blockedUsers.json');
const USAGE_FILE = path.join(__dirname, '../data/usageTokens.json');

// Load or initialize block/usage data
function loadJson(file, fallback) {
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf-8'));
    }
  } catch {}
  return fallback;
}

let blockedUsers = loadJson(BLOCK_FILE, {});
let usageTokens = loadJson(USAGE_FILE, {});

function saveBlocked() {
  fs.writeFileSync(BLOCK_FILE, JSON.stringify(blockedUsers, null, 2));
}
function saveUsage() {
  fs.writeFileSync(USAGE_FILE, JSON.stringify(usageTokens, null, 2));
}

function now() { return Date.now(); }

function isBlocked(uuid) {
  const entry = blockedUsers[uuid];
  if (!entry) return false;
  if (entry.until && entry.until > now()) return true;
  // Unblock if expired
  delete blockedUsers[uuid];
  saveBlocked();
  return false;
}

function blockUser(uuid, minutes = 60) {
  const prev = blockedUsers[uuid];
  let increment = minutes;
  if (prev && prev.increment) increment = prev.increment * 2;
  blockedUsers[uuid] = { until: now() + increment * 60 * 1000, increment };
  saveBlocked();
}

function flagUser(uuid, reason = 'abuse') {
  blockedUsers[uuid] = { flagged: true, reason };
  saveBlocked();
}

function checkRateLimit(uuid, service) {
  const hour = new Date().getHours();
  if (!usageTokens[uuid]) usageTokens[uuid] = {};
  if (!usageTokens[uuid][service] || usageTokens[uuid][service].hour !== hour) {
    usageTokens[uuid][service] = { count: 0, hour };
  }
  usageTokens[uuid][service].count++;
  saveUsage();
  if (usageTokens[uuid][service].count > RATE_LIMIT) {
    blockUser(uuid);
    return false;
  }
  return true;
}

function unblockUser(uuid) {
  delete blockedUsers[uuid];
  saveBlocked();
}

function getBlockStatus(uuid) {
  return blockedUsers[uuid] || null;
}

module.exports = {
  isBlocked,
  blockUser,
  flagUser,
  checkRateLimit,
  unblockUser,
  getBlockStatus
};
