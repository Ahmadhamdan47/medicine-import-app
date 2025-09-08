// Rate limiting middleware for public endpoints
const rateLimitMap = new Map();

// Simple rate limiter to prevent abuse of public registration upload endpoint
const registrationUploadRateLimit = (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 10; // 10 requests per 15 minutes per IP

    if (!rateLimitMap.has(clientIp)) {
        rateLimitMap.set(clientIp, { count: 1, resetTime: now + windowMs });
        return next();
    }

    const clientData = rateLimitMap.get(clientIp);

    // Reset window if time has passed
    if (now > clientData.resetTime) {
        rateLimitMap.set(clientIp, { count: 1, resetTime: now + windowMs });
        return next();
    }

    // Check if client has exceeded limit
    if (clientData.count >= maxRequests) {
        return res.status(429).json({
            error: 'Too many upload requests. Please try again later.',
            retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
        });
    }

    // Increment count
    clientData.count += 1;
    rateLimitMap.set(clientIp, clientData);
    next();
};

// Clean up expired entries every hour
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimitMap.entries()) {
        if (now > data.resetTime) {
            rateLimitMap.delete(ip);
        }
    }
}, 60 * 60 * 1000);

module.exports = {
    registrationUploadRateLimit
};
