import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res){
    const {method} = req;
    await mongooseConnect();

    if (method === 'GET'){
        res.json(await Category.find().populate('parent'));
    }

    if(method === 'POST' ){
        const {name, parentCategory,properties} = req.body;
        const Categorydoc = await Category.create({
            name,
            parent:parentCategory || undefined,
            properties,
        });
        res.json(Categorydoc)  
    }

    if(method === 'PUT') {
        const {name, parentCategory,properties,_id} = req.body;
        const Categorydoc = await Category.updateOne({_id},{
            name,
            parent:parentCategory || undefined,
            properties,
        });
        res.json(Categorydoc) 
    }

    if (method === 'DELETE') {
        const {_id} = req.query;
        await Category.deleteOne({_id});
        res.json('ok');
    }
}