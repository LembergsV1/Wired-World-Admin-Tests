import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Spinner from "./Spinner";
import {ReactSortable} from "react-sortablejs";



export default function ProductsForm({
    _id,
    title:existingTitle,
    description:existingDescription,
    price:existingPrice,
    images:existingImages,
}){
    
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = 
        useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    async function saveProduct(ev){
        ev.preventDefault();
        const data = {title, description, price, images}
        if (_id) {
            //update
            await axios.put('/api/products', {...data,_id}); 
        }else{
            //create
            await axios.post('/api/products', data)
        }
        setGoToProducts(true);
    }
    if (goToProducts){
        router.push('/products');
    }
    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
          setIsUploading(true);

          const data = new FormData();
          for (const file of files) {
            data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
        

    }
    function updateImagesOrder(){
        setImages(images);
        console.log(arguments);
    }
    return(
            <form onSubmit={saveProduct}>
            <label>Product name</label>
            <input 
                type="text"
                placeholder="product name" 
                value={title}
                onChange={ev => setTitle(ev.target.value)}/>
            <label>
                Photos
            </label>
            <div className="mb-2 flex flex-wrap gap-2">

                {!!images?.length && images.map(link => (
                    <div key={link} className="h-24 ">
                        <img src={link} alt="" className="rounded-sm"/>
                    </div>
                ))}
                <ReactSortable 
                    list={images} 
                    className="flex flex-wrap gap-1"
                    setList={updateImagesOrder}>
                {isUploading && (
                    <div className="h-24 p-1 bg-gray-200 flex items-center">
                        <Spinner />
                    </div>
                )}
                </ReactSortable>
                <label className="w-32 h-32 border cursor-pointer text-center flex items-center justify-center text-sm gap-1 text-gray-600 rounded-sm bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <div>
                    Upload photo
                </div>
                <input type="file" onChange={uploadImages} className="hidden"/>
                </label>
                {!images?.length && (
                    <div>There are no images here!</div>
                )}
            </div>
            <label>Product description</label>
            <textarea  
                placeholder="description" 
                value={description}
                onChange={ev => setDescription(ev.target.value)}
            />
            <label>Product price (in EUR)</label>
            <input 
                type="number" 
                placeholder="price"
                value={price}
                onChange={ev => setPrice(ev.target.value)} 
            />
            <button 
                type="submit"
                className="btn-primary">
                Save Item
            </button>
            </form>  
       
    );
}