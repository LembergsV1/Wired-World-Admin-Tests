import ProductsForm from "@/components/ProductsForm";
import Layout from "@/components/Layout";


export default function NewProduct(){
    return(
        <Layout>
            <h1>Pievienot jaunu preci</h1>
            <ProductsForm/>
        </Layout>
    );
    
}
