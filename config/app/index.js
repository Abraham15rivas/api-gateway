export const config = {
  allowedOrigins: [
    `${process.env.APP_GATEWAY_URL}:${process.env.APP_GATEWAY_PORT}`,
    `${process.env.APP_WALLET_CLIENT_URL}`
  ],
  corsOptions: {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }
}

export const corsOptionsDelegate = (req, callback) => {
  let response = null
  let corsOptions
  let origin = req.header('Origin')

  if (origin && config.allowedOrigins.indexOf(origin) !== -1) {
    corsOptions = { ...config.corsOptions }
  } else {
    corsOptions = { origin: false }
		response = new Error('Not allowed by CORS')
  }

  callback(response, corsOptions)
}