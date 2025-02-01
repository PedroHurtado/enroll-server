import express, {Request,Response} from 'express';
import { registerFeatures } from '@enroll-server/common'
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
})
registerFeatures(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});