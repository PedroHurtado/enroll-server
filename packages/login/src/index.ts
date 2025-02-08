import express, {Express} from 'express';
import cors from "cors";
import { 
  registerFeatures, 
  registerKongEntities,
  loggerApp, 
  tenat,
  redis  
} from '@enroll-server/common'
import { Logger } from 'pino';



const { httpLogger, logger } = loggerApp('http://localhost:9200');

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"],
  maxAge: 3600
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(httpLogger);
app.use(tenat(redis))

const PORT = process.env.PORT || 3000;

!async function init(app:Express,logger:Logger ) {
  try {
    
    await registerFeatures(app, logger) 
    await registerKongEntities("login-service",[
      { name: 'route-root', path: '/', methods: ['GET'] },
      { name: 'route-login', path: '/login', methods: ['POST'] },
    ]);
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
  catch (err) {
    console.error('❌ Error al registrar características:', err);
    process.exit(1)
  }
}(app,logger)



