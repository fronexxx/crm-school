import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ordersService} from "../../services/ordersService";
import OrderComponent from "./OrderComponent";
import './Orders.css'
const OrdersComponent = () => {
    const [orders, setOrders] = useState([]);
    const [groups, setGroups] = useState([])
    const [pageInfo, setPageInfo] = useState({});
    const [error, setError] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;

    const loadOrders = async () => {
        try {
            const value = await ordersService.getAllOrders(Object.fromEntries(searchParams));
            setOrders(value.data);
            setPageInfo({prev: value.prev, next: value.next});
        } catch (e) {
            setError(e.message)
        }
    };


    const goToPage = (p) => setSearchParams(prev => {
        prev.set('page', p);
        return prev
    });

    useEffect(() => {
        void loadOrders()
    }, [searchParams])

    useEffect(() => {
        ordersService.getGroups()
            .then(value => setGroups(value))
            .catch(e => setError(e.message))
    }, [])

    if (error) {
        return <div className="orders-error">{error}</div>
    }
    return (
        <div className="orders-page">
            <table className="orders-table">
                <thead>
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>surname</th>
                    <th>email</th>
                    <th>phone</th>
                    <th>age</th>
                    <th>course</th>
                    <th>course_format</th>
                    <th>course_type</th>
                    <th>status</th>
                    <th>sum</th>
                    <th>alreadyPaid</th>
                    <th>group</th>
                    <th>created_at</th>
                    <th>manager</th>
                </tr>
                </thead>
                <tbody>{orders.map(order => <OrderComponent key={order.id} order={order} groups={groups}/>)}</tbody>
            </table>
            <div className="orders-pagination">
                <button className="orders-btn" disabled={!pageInfo.prev} onClick={() => {
                    goToPage(page - 1);
                }}>prev
                </button>
                <button className="orders-btn" disabled={!pageInfo.next} onClick={() => {
                    goToPage(page + 1);
                }}>next
                </button>
            </div>
        </div>
    );
};

export default OrdersComponent;