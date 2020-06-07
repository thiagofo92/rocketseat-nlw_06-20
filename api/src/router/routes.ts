import express from 'express';
import { celebrate, Joi } from 'celebrate'

import PointsController from './../controller/PointsController';
import ItemsController from './../controller/ItemsController';

import multer from 'multer';
import configMulter from '../config/multer';

const routes = express.Router();
const uploads = multer(configMulter);

//index, show, create, update, delete
//Padrao da comunidade com relacao a nome de metodos dos controller
//index para lista
//show para mostrar um unico item
//
const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);

routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

routes.post('/points', 
uploads.single('image'),
celebrate({
    body:Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude:Joi.number().required(),
        longitude:Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items:Joi.string().required(),
    })
}), 
pointsController.create);


export default routes;