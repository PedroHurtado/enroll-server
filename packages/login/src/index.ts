import express, {Express} from 'express';
import cors from "cors";
import { 
  registerFeatures, 
  registerKongEntities,
  loggerApp, 
  tenat,
  redis,  
  HOSTS
} from '@enroll-server/common'

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"],
  maxAge: 3600
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());


const PORT = process.env.PORT || 3000;

!async function init(app:Express) {
  try {
    const { httpLogger, logger } = loggerApp(`http://${HOSTS.elasticsearch}:9200`);
    app.use(httpLogger);
    app.use(tenat(redis))
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
}(app)



