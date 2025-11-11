//==================================================
//              DEPENDENCIES
//==================================================
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

//==================================================
//              Modules
//==================================================
import proxyRoutes from './routes/proxy.routes.js';
import { corsOptionsDelegate } from './config/app/index.js'

//==================================================
//              API - RestFul
//==================================================
const app = express();

const appGatewayPort        = process.env.APP_GATEWAY_PORT || 4000;
const appServiceDbLayerUrl  = process.env.APP_SERVICE_DB_LAYER_URL || 'http://localhost:3000';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptionsDelegate))
app.use(helmet());
app.disable('x-powered-by');
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
      fontSrc: ["'self'"]
    },
  })
);

app.use('/api/v1', proxyRoutes);
app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: 'Resource not found in API Gateway.',
    data: null
  });
});

/* Run Serve */
app.listen(appGatewayPort, async () => {
  console.log(`🚀 API Gateway (Fachada) listening on port ${appGatewayPort}`);
  console.log(`➡️  Proxying requests to REST DB Service at ${appServiceDbLayerUrl}`);
})