import express from 'express';
import cors from "cors";
import pino from 'pino';
import pinoHttp from 'pino-http';
import pinoElastic from 'pino-elasticsearch';
import { registerFeatures } from '@enroll-server/common'
const streamToElastic = pinoElastic({
  index: 'logs-app',  
  node: 'http://elasticsearch:9200'  // Cambia esto a tu URL de Elasticsearch
});
const logger = pino({}, streamToElastic);
const httpLogger = pinoHttp({ logger });

const corsOptions = {
  origin: "*",
  methods: ["GET","POST","PUT", "PATCH", "DELETE", "HEAD"],  
  maxAge: 3600
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(httpLogger);

const PORT = process.env.PORT || 3000;

async function init(){
  try{
    await registerFeatures(app)
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
  catch(err){
    console.error('❌ Error al registrar características:', err);
  }
}
init()


