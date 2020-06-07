import express from 'express';
import routes from './../router/routes';
import cors from 'cors';
import path from 'path';
import { errors } from 'celebrate';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', '..', 'uploads')));

app.use(errors);

app.listen(4500);