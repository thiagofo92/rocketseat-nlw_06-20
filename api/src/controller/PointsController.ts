import knex from './../database/connection';
import { Request, Response } from 'express';

class PointsController{
    async create(request : Request, response : Response){
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
        const trx = await knex.transaction();
        
        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };
        const insertedIds = await trx('point').insert(point);
        const point_id = insertedIds[0]

        const pointItems = items
        .split(',')
        .map((item : string) => Number(item.trim()))
        .map((items_id : number) => {
            return {
                items_id,
                point_id :point_id,
            };
        })
    
        await trx('point_items').insert(pointItems);

        await trx.commit();
        response.json({
            point_id,
            ...point
        });
    }

    async show(request : Request, response : Response){
        const { id } = request.params;

        const point  = await knex('point').where('id', id).first();
        
        if(!point){
            return response.status(400).json({message: 'Point not found'})
        }
        
        const items = await knex('items')
        .join('point_items', 'items.id', '=', 'point_items.items_id')
        .where('point_items.point_id', id)
        .select('title');


        const serializedPoint = {
                ...point,
                image_url: `http://192.168.1.9:4500/uploads/${point.image}`,
            };

        return response.json({point : serializedPoint, items});
        
    }

    async index (request : Request, response : Response){
        const { city , uf , items } = request.query;

        console.log({city, uf, items});

        const parsedItems = String(items).split(',')
                            .map(item => Number(item.trim()));

        const points = await knex('point')
        .join('point_items', 'point.id', '=', 'point_items.point_id')
        .whereIn('point_items.items_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('point.*');


        const serializedPoints = points.map(point => {
            return {
                ...points,
                image_url: `http://192.168.1.9:4500/uploads/${point.image}`,
            };
        });


        return response.json(serializedPoints);
    }
}

export default PointsController;