import express from 'express';
import bodyParser from 'body-parser';
import { Request,Response } from 'express';

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req : Request, res : Response) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})