import express from 'express';
import cors from "cors";
import { registerFeatures } from '@enroll-server/common'
import { loggerApp } from '@enroll-server/common';


const {httpLogger} = loggerApp('http://localhost:9200');

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


