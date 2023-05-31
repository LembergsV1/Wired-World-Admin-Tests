import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function SettingsPage({swal}){
    const [products, setProducts] = useState([]);
    const [featuredProductId, setFeaturedProductId] = useState('');
    const [productsLoading, setProductsLoading] = useState(false);
    const [featuredLoading, setFeaturedLoading] = useState(false);

    useEffect(() => {
        setProductsLoading(true);
        axios.get('/api/products').then(res => {
            setProducts(res.data);
            setProductsLoading(false);
        });
        setFeaturedLoading(true);
        axios.get('/api/settings?name=featuredProductId').then(res => {
            setFeaturedProductId(res.data.value);
            setFeaturedLoading(false);
        });
    }, []);

    async function saveSettings(){
        await axios.put('/api/settings', {
            name: 'featuredProductId',
            value: featuredProductId,
        }).then(() => {
            swal.fire({
                title: 'Iestatījums saglabāts',
                icon: 'success',
            });
        });
    }
    return(
        <Layout>
            <h1>Veikala Iestatījumi</h1>
            {(productsLoading || featuredLoading) && (
                <Spinner/>
            )}
            {(!productsLoading && !featuredLoading) && (
                <>
                    <label>Galvenā prece</label>
                    <select value={featuredProductId} onChange={ev => setFeaturedProductId(ev.target.value)}>
                        {products.length > 0 && products.map(product => (
                            <option value={product._id}>{product.title}</option>
                        ))}
                    </select>
                        <div>
                        <button onClick={saveSettings} className="btn-primary">Saglabāt</button>
                    </div>
                </>
            )}
        </Layout>
    );
}

export default withSwal(({swal}) => (
    <SettingsPage swal={swal} />
));