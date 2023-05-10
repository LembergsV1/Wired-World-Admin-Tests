import ProductsForm from "@/components/ProductsForm";
import Layout from "@/components/Layout";


export default function NewProduct(){
    return(
        <Layout>
            <h1>Pievienot jaunu produktu</h1>
            <ProductsForm/>
        </Layout>
    );
    
}
