import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';


function Categories({swal}){
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        fetchCategories();
    }, [])
    function fetchCategories(){
        setIsLoading(true);
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
            setIsLoading(false);
        });
    }
    async function saveCategory(ev){
        ev.preventDefault();
        const data = {name,parentCategory,properties:properties.map(p => ({name:p.name,values:p.values.split(',')}))}
        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        }else {
            await axios.post('api/categories/', data);
        }
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }

    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(category.properties.map(({name, values}) => ({
            name, 
            values:values.join(',')
        }))
        );   
    }
    function deleteCategory(category){
        swal.fire({
            title: 'Vai esat pārliecināts?',
            text: `Vai tiešām vēlaties izdzēst ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Atcelt',
            confirmButtonText: 'Dzēst!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed){
                const{_id} = category;
                await axios.delete('/api/categories?_id='+_id,);
                fetchCategories();
            }
        });
    }
    function addProperty() {
        setProperties(prev =>{
            return[...prev, {name:'', values:''}]
        });
    }
    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties; 
        });
    }
    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties; 
        });
    }
    function removeProperty(indexToRemove){
        setProperties(prev => {
            return [...prev].filter((p,pIndex) => {
                return pIndex !==indexToRemove;
            })
        });
    }

    return(
        <Layout>
            <h1>Kategorijas</h1>
            <label>
            {editedCategory
                ? `Rediģēt kategoriju ${editedCategory.name}`
                : 'Izveidot jaunu kategoriju'}
            </label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                <input 
                     type="text"
                    placeholder={'Kategorijas nosaukums'}
                     onChange={ev => setName(ev.target.value)}
                     value={name} />
                <select  
                        onChange={ev => setParentCategory(ev.target.value)}
                        value={parentCategory}>
                    <option value="">Nav Apakškategorijas</option>
                    {categories.length > 0 && categories.map(category => (
                        <option value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                </div>
                <div className="mb-1">
                    <label className="block">Īpašība</label>
                    <button type="button"
                        onClick={addProperty}
                         className="btn-default text-sm mb-2">
                            Pievienot Īpašību
                    </button>
                    {properties.length > 0 && properties.map((property,index) =>(
                        <div className="flex gap-1 mb-2">
                            <input type="text" value={property.name} className="mb-0" onChange={ev => handlePropertyNameChange(index,property,ev.target.value)} placeholder="Īpašības nosaukums (piem: Krāsa)"></input>
                            <input type="text" value={property.values} className="mb-0" onChange={ev => handlePropertyValuesChange(index, property, ev.target.value)} placeholder="vērtības, "></input>
                            <button className="btn-deny mr-1"
                                onClick={() => removeProperty(index)}
                                type="button">
                                Noņemt
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                {editedCategory && (
                    <button 
                        type="button"
                        onClick={() => {
                        setEditedCategory(null);
                        setName('');
                        setParentCategory('');
                        }}
                        className="btn-deny"
                        >Atcelt</button>
                )}
                <button type="submit" 
                    className="btn-primary py-1">
                        Saglabāt
                </button>
                </div>
            </form>
            {!editedCategory && (
                <table className="basic mt-5">
                <thead>
                    <tr>
                        <td>Visas Kategorijas</td>
                        <td>Apakškategorija</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={3}>
                                <div className="py-4">
                                    <Spinner fullWidth={true}/>
                                </div>
                            </td>
                        </tr>
                    )}
                    {categories.length > 0 && categories.map(category => (
                        <tr>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <button  
                              onClick={() => editCategory(category)}
                              className="btn-primary mr-1 mb-1">
                                    Rediģēt
                            </button>
                            <button 
                                onClick={() => deleteCategory(category)}
                                className="btn-deny">Dzēst
                            </button>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </Layout>
    );
}



export default withSwal (({swal}, ref) => (
    <Categories swal={swal} />
));