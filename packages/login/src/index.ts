import express from 'express';
import cors from "cors";
import { registerFeatures } from '@enroll-server/common'


const corsOptions = {
  origin: "*",
  methods: ["GET","POST","PUT", "PATCH", "DELETE", "HEAD"],  
  maxAge: 3600
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

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


