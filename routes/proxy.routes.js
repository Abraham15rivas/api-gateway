import { Router } from 'express';
import proxy from 'express-http-proxy';

const appServiceDbLayerUrl  = process.env.APP_SERVICE_DB_LAYER_URL || 'http://localhost:3000';
const appGatewayOriginUrl   = `${process.env.APP_GATEWAY_URL}:${process.env.APP_GATEWAY_PORT}` || 'http://localhost:4000'

const router = Router();

const nestjsProxy = proxy(appServiceDbLayerUrl, {
  proxyReqPathResolver: (req) => req.originalUrl,

  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers['origin'] = appGatewayOriginUrl
    return proxyReqOpts;
  },

  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    const origin = userReq.headers['origin'];
    userRes.setHeader('Access-Control-Allow-Origin', origin);

    return proxyResData;
  },

  userResHeaderDecorator: (headers, userReq) => {
    const origin = userReq.headers['origin'];

    return {
      ...headers,
      'Access-Control-Allow-Origin': origin
    };
  },

  proxyErrorHandler: (err, res, next) => {
    console.error('[PROXY ERROR]:', err.message);
    res.status(503).json({
      statusCode: 503,
      message: 'Service Temporarily Unavailable (NestJS API is down).',
      data: null
    })
  }
});

/* Auth */
router.post('/auth/login', nestjsProxy);
router.post('/auth/register', nestjsProxy);

/* User */
router.post('/users/top-up', nestjsProxy);
router.post('/users/balance', nestjsProxy);
router.patch('/users/:document/start-payment', nestjsProxy)
router.patch('/users/check-payment', nestjsProxy)

/* Purchase */
router.post('/purchases', nestjsProxy);
router.get('/purchases/:document', nestjsProxy);

export default router;