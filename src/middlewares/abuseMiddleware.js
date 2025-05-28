// src/middlewares/abuseMiddleware.js
// Simple in-memory abuse tracking and blocking. For production, use Redis or a database.
const abuseStore = {};
const blockStore = {};
const LIMIT_PER_HOUR = 10; // Max allowed requests per hour per uuid/service
const BASE_BLOCK_MINUTES = 10; // Initial block time in minutes

function getKey(uuid, service) {
  return `${uuid}:${service}`;
}

function isBlocked(uuid) {
  const block = blockStore[uuid];
  if (!block) return false;
  if (Date.now() > block.until) {
    delete blockStore[uuid];
    return false;
  }
  return true;
}

function abuseMiddleware(serviceName) {
  return (req, res, next) => {
    const uuid = req.body.uuid || req.query.uuid || req.headers['x-uuid'];
    if (!uuid) return res.status(400).json({ error: 'UUID is required for abuse protection.' });
    if (isBlocked(uuid)) {
      return res.status(429).json({ error: 'Too many requests. User is temporarily blocked due to abuse.' });
    }
    const key = getKey(uuid, serviceName);
    const now = Date.now();
    const hour = 60 * 60 * 1000;
    if (!abuseStore[key] || now - abuseStore[key].start > hour) {
      abuseStore[key] = { count: 1, start: now };
    } else {
      abuseStore[key].count++;
      if (abuseStore[key].count > LIMIT_PER_HOUR) {
        // Block user for incrementally longer time
        const prevBlock = blockStore[uuid]?.blockCount || 0;
        const blockMinutes = BASE_BLOCK_MINUTES * (prevBlock + 1);
        blockStore[uuid] = {
          until: now + blockMinutes * 60 * 1000,
          blockCount: prevBlock + 1
        };
        return res.status(429).json({ error: `Too many requests. User is blocked for ${blockMinutes} minutes.` });
      }
    }
    next();
  };
}

// API to block a uuid manually (e.g., for unfair competition)
function blockUuid(uuid, minutes = 60) {
  blockStore[uuid] = {
    until: Date.now() + minutes * 60 * 1000,
    blockCount: (blockStore[uuid]?.blockCount || 0) + 1
  };
}

// API to check if a uuid is blocked
function isUuidBlocked(uuid) {
  return isBlocked(uuid);
}

// Manual flag/block/unblock API helpers for controller use
function flagUser(uuid, reason = 'abuse') {
  blockStore[uuid] = {
    until: Date.now() + 365 * 24 * 60 * 60 * 1000, // Effectively permanent block
    blockCount: 99,
    flagged: true,
    reason
  };
}
function unblockUser(uuid) {
  delete blockStore[uuid];
}
function getBlockStatus(uuid) {
  return blockStore[uuid] || null;
}

module.exports = {
  abuseMiddleware,
  blockUuid,
  isUuidBlocked,
  flagUser,
  unblockUser,
  getBlockStatus
};
