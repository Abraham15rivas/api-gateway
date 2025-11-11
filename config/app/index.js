export const config = {
  allowedOrigins: [
    `${process.env.APP_GATEWAY_URL}:${process.env.APP_GATEWAY_PORT}`,
    `${process.env.APP_WALLET_CLIENT_URL}`
  ],
  corsOptions: {
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }
}

export const corsOptionsDelegate = (req, callback) => {
  let origin = req.header('Origin')

  const normalizedOrigin = origin?.trim().toLowerCase();
  const allowed = config.allowedOrigins.map(o => o.trim().toLowerCase());

  if (normalizedOrigin && allowed.includes(normalizedOrigin)) {
    callback(null, { ...config.corsOptions });
  } else {
    console.warn('Blocked by CORS:', origin);
    callback(new Error('Not allowed by CORS'), { origin: false });
  }
}