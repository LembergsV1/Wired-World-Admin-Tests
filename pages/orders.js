import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage(){
    const[orders,setOrders] = useState([])
    useEffect(() => {
        axios.get('/api/orders').then(response => {
            setOrders(response.data);
        });
    }, []);
    return(
        <Layout>
            <h1>Pasūtījumi</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Laiks</th>
                        <th>Samaksāts</th>
                        <th>Sūtītājs</th>
                        <th>Prece/s</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map(order =>(
                        <tr>
                            <td>{(new Date(order.createdAt)).toLocaleString()}
                            </td>
                            <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                                {order.paid ? 'JĀ' : 'NĒ'}
                            </td>
                            <td>
                                {order.name} {order.email}<br/>
                                {order.city} {order.postalCode} {order.country} <br/>
                                {order.streetAdress}
                            </td>
                            <td>
                                {order.line_items.map(l => (
                                    <>
                                        {l.price_data?.product_data.name} x {l.quantity}<br/>
                                        
                                    </>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}