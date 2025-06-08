import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { logger } from './utils/logger';
import { AppError } from './utils/errors';
import { digitalAssetsRouter } from './routes/digitalAssets';
import { adminRouter } from './routes/admin';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '8000');

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    // logger.logRequest(req, res);
    logger.debug('PERFORMANCE', `Request completed in ${duration}ms`, {
      method: req.method,
      url: req.url,
      status: res.statusCode
    });
  });
  
  next();
});

const swaggerDocument = YAML.load('./src/swagger/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy' });
});


app.use('/api', digitalAssetsRouter);
app.use('/api/admin', adminRouter);



app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('ERROR', 'An error occurred during request processing', {
    error: err.message,
    stack: err.stack,
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers
    }
  });

  const statusCode = err instanceof AppError ? err.status : 500;
  const errorMessage = err instanceof AppError ? err.message : 'An unexpected error occurred';

  res.status(statusCode).json({
    error: errorMessage,
    ...(err instanceof AppError && !err.isOperational ? { details: err.stack } : {})
  });
});


app.listen(PORT, () => {
  logger.success('SERVER', `Server is running on port ${PORT}`);
  logger.info('SERVER', `API documentation available at http://localhost:${PORT}/api-docs`);
});