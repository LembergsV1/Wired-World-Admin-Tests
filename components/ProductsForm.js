import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import {ReactSortable} from "react-sortablejs";



export default function ProductsForm({
    _id,
    title:existingTitle,
    description:existingDescription,
    price:existingPrice,
    images:existingImages,
    category:existingCategory,
    properties:assignedProperties,
}){
    
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = 
        useState(existingDescription || '');
    const [category, setCategory] = useState(existingCategory || '');
    const [productProperties, setProductProperties] = useState (assignedProperties || {});
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories,setCategories] = useState([]);
    const router = useRouter();
    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }, [])
    async function saveProduct(ev){
        ev.preventDefault();
        const data = {title, description, price, images, category,
            properties:productProperties}
        if (_id) {
            await axios.put('/api/products', {...data,_id}); 
        }else{
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
    function updateImagesOrder(images) {
        setImages(images);
    }

    function setProductProp(propName, value){
        setProductProperties(prev =>{
            const newProductProps = {...prev};
            newProductProps[propName] = value;
            return newProductProps;
        })
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({_id}) => _id === category);
        propertiesToFill.push(...catInfo.properties);
    while(catInfo?.parent?._id) {
      const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

    return(
            <form onSubmit={saveProduct}>
            <label>Preces nosaukums</label>
            <input 
                type="text"
                placeholder="Produkta nosaukums" 
                value={title}
                onChange={ev => setTitle(ev.target.value)}/>
            <label>
                Kategorija
            </label>
            <select value={category} onChange={ev => setCategory(ev.target.value)}>
            <option value="">Bez kategorijas</option>
                {categories.length > 0 && categories.map(c => (
            <option value={c._id}>{c.name}</option>
          ))}
            </select>
            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div className="">
                    <label>{p.name}</label>
                    <div>
                    <select value={productProperties[p.name]} onChange={ev => 
                            setProductProp(p.name,ev.target.value)
                            }>
                        {p.values.map(v => (
                            <option value={v}>{v}</option>
                        ))}
                    </select>
                    </div>
                </div>
            ))}
            <label>
                Foto
            </label>
            <div className="mb-2 flex flex-wrap gap-1">
          <ReactSortable
            list={images}
            className="flex flex-wrap gap-1"
            setList={updateImagesOrder}>
            {!!images?.length && images.map(link => (
              <div key={link} className="h-32 p-4 shadow-sm rounded-sm border border-gray-200">
                <img src={link} alt="" className="rounded-sm"/>
              </div>
            ))}
          </ReactSortable>
          {isUploading && (
            <div className="h-24 flex items-center">
              <Spinner />
            </div>
          )}
                <label className="w-32 h-32 border cursor-pointer text-center flex items-center justify-center text-sm gap-1 text-AAA rounded-sm bg-white shadow-md border-AAA">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <div>
                    Pievienot foto
                </div>
                <input type="file" onChange={uploadImages} className="hidden"/>
                </label>
                {!images?.length && (
                    <div>Pašlaik nav neviena foto!</div>
                )}
            </div>
            <label>Preces apraksts</label>
            <textarea  
                placeholder="apraksts" 
                value={description}
                onChange={ev => setDescription(ev.target.value)}
            />
            <label>Cena(EUR)</label>
            <input 
                type="number" 
                placeholder="cena"
                value={price}
                onChange={ev => setPrice(ev.target.value)} 
            />
            <button 
                type="submit"
                className="btn-primary">
                Saglabāt
            </button>
            </form>  
       
    );
}