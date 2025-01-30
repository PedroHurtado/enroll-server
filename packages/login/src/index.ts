import express from 'express';
import {registerFeatures} from '@enroll-server/common'
const app = express();
const PORT = process.env.PORT || 3000;

registerFeatures(app);  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});