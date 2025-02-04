import express from 'express';
import { registerFeatures } from '@enroll-server/common'
const app = express();
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


