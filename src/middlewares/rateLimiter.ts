import {rateLimit} from 'express-rate-limit'

// rate limit the user for 100req/hr
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP"
});

export const limiterMiddleware = limiter;