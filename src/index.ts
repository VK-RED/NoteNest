import express from 'express';
import bodyParser from 'body-parser';
import { Request,Response } from 'express';

const app = express();
const PORT = 3000;
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

router.get('/', (req : Request, res : Response) => {
  res.json({message:'The Server is Up !!!'})
})

app.use(router);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})