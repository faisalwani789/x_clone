// Store request counts per IP
const requestCounts = {};

// export const rateLimit = async (req, res, next) => {
//     try {
//         const ip = req.ip;
//         const now = Date.now();
//           const maxRequests = 2; //in 5 mins 2 reqs


//         if (!requestCounts[ip]) {
//             requestCounts[ip] = { count: 1, lastRequest: now };
//         } 
//         else {
//             const timeSinceLastRequest = now - requestCounts[ip].lastRequest; //time since last request
//             const timeLimit = 5 * 60 * 1000; // 5 minutes

//             if (timeSinceLastRequest < timeLimit) {
//                 requestCounts[ip].count += 1;
//             } else {
//                 requestCounts[ip] = { count: 1, lastRequest: now }; // Reset after time window
//             }
//         }

      
//         if (requestCounts[ip].count > maxRequests) {
//             return res.status(429).json({ message: 'Too many requests, please try again later.' });
//         }

//         //requestCounts[ip].lastRequest = now;
//         next();
    
// } catch (error) {
//     console.log(error)
// }
// }

// const requestCounts = {};

export const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const timeLimit = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;
try {
  if (!requestCounts[ip]) {
    requestCounts[ip] = {
      count: 1,
      windowStart: now
    };
  } else {
    const timePassed = now - requestCounts[ip].windowStart;

    if (timePassed < timeLimit) {
      requestCounts[ip].count += 1;
    } else {
      // Reset window
      requestCounts[ip] = {
        count: 1,
        windowStart: now
      };
    }
  }

  if (requestCounts[ip].count > maxRequests) {
    return res.status(429).json({
      message: "Too many requests. Try again later."
    });
  }

  next();
} catch (error) {
  res.status(500).json(error.message)
}
  
};
