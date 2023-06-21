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
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        setCategoriesLoading(true);
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
            setCategoriesLoading(false);
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

    function removeImage(imageLink) {
        setImages(oldImages => {
            const updatedImages = oldImages.filter(link => link !== imageLink);
            return updatedImages;
        });
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
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
            </select>
            {categoriesLoading && (
                <Spinner/>
            )}
            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div key={p.name} className="">
                    <label>{p.name}</label>
                    <div>
                    <select value={productProperties[p.name]} onChange={ev => 
                            setProductProp(p.name,ev.target.value)
                            }>
                        {p.values.map(v => (
                            <option key={v} value={v}>{v}</option>
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
            list={images} className="flex flex-wrap gap-1" setList={updateImagesOrder}>
            {!!images?.length && images.map(link => (
                <div key = {link} className="text-center flex flex-col items-center justify-center text-sm h-32 bg-white p-4 shadow-md rounded-sm border border-gray-200">
                    <img src={link} alt="" className="rounded-lg"/>
                    <button className="remove-image-button" onClick={() => removeImage(link)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            ))}
          </ReactSortable>
          {isUploading && (
            <div className="h-24 flex items-center">
              <Spinner />
            </div>
          )}
                <label className="w-32 h-32 border cursor-pointer text-center flex items-center justify-center text-sm gap-1 text-gray rounded-sm bg-white shadow-md border-gray">
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