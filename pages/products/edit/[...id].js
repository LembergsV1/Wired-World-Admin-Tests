import Layout from "@/components/Layout";
import ProductsForm from "@/components/ProductsForm";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage(){
    const [productInfo, setProductInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        if (!id){
            return;
        }
        setIsLoading(true);
        axios.get(`/api/products?id=${id}`).then(response => {
            setProductInfo(response.data);
            setIsLoading(false);
        });
    }, [id]);
    return (
        <Layout>
            <h1>Rediģēt preci</h1>
            {isLoading && (
                <Spinner/>
            )}
            {productInfo && (
                <ProductsForm {...productInfo}/>
            )}
        </Layout>
    );
}
