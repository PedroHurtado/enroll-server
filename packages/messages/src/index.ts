import express, { Express } from 'express';
import cors from "cors";
import {
  registerFeatures,
  registerKongEntities,
  loggerApp,
  tenat,
  redis,
  context,
} from '@enroll-server/common'
import { config } from './config';

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"],
  maxAge: 3600
};

const app = express();


!async function init(app: Express) {
  try {
    const { httpLogger, logger } = loggerApp(config.elastic, config.name);
    
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(httpLogger);
    app.use(tenat(redis))
    app.use(context())
    
    await registerFeatures(app, logger, import.meta.url)

    app.listen(config.port, () => {
      console.log(`Server is running on http://localhost:${config.port}`);
    });
  }
  catch (err) {
    console.error('❌ Error al registrar características:', err);
    process.exit(1)
  }
}(app)



