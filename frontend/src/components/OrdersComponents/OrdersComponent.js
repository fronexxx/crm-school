import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ordersService} from "../../services/ordersService";
import OrderComponent from "./OrderComponent";
import './Orders.css'
import ReactPaginate from "react-paginate";
import {authService} from "../../services/authService";

const OrdersComponent = () => {
    const [orders, setOrders] = useState([]);
    const [groups, setGroups] = useState([])
    const [pageInfo, setPageInfo] = useState({
        totalItems: 0,
        totalPages: 0,
        prev: false,
        next: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get('page') || 1) - 1;

    const loadOrders = async (retry = false) => {
        try {
            setLoading(true);
            const value = await ordersService.getAllOrders(Object.fromEntries(searchParams));

            setPageInfo({
                totalItems: value.total_items,
                totalPages: value.total_pages,
                prev: value.prev,
                next: value.next
            });

            setOrders(value.data);
        } catch (e) {
            if (e.status === 401 && !retry) {
                try {
                    await authService.refresh();
                    return loadOrders(true);
                } catch (e) {
                    setError('Session expired. Please log in again.')
                }
            } else {
                setError(e.message)
            }
        } finally {
            setLoading(false)
        }
    };


    // const goToPage = (p) => setSearchParams(prev => {
    //     prev.set('page', p);
    //     return prev
    // });

    useEffect(() => {
        void loadOrders()
    }, [searchParams])

    useEffect(async () => {
        try {
            const value = await ordersService.getGroups();
            setGroups(value);
        } catch (e) {
            setError(e.message)
        }

    }, [])

    const handlePageChange = (data) => {
        const page = data.selected;


        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.set('page', page + 1);
            return params
        });

        window.scroll({top: 0, behavior: "smooth"});

    };

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
                <tbody>
                {loading
                    ? <tr>
                        <td className="orders-loading" colSpan={15}>Loading...</td>
                    </tr>
                    : orders.map(order => <OrderComponent key={order.id} order={order} groups={groups}/>)}
                </tbody>
            </table>
            <div>
                <ReactPaginate
                    pageCount={pageInfo.totalPages}
                    forcePage={currentPage}
                    onPageChange={handlePageChange}
                    previousLabel="<"
                    nextLabel=">"
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    containerClassName="orders-paginate"
                    pageClassName="orders-paginate-item"
                    pageLinkClassName="orders-paginate-link"
                    activeLinkClassName="orders-paginate-link--active"
                    previousClassName="orders-paginate-item"
                    previousLinkClassName="orders-paginate-link orders-paginate-nav"
                    nextClassName="orders-paginate-item"
                    nextLinkClassName="orders-paginate-link orders-paginate-nav"
                    breakClassName="orders-paginate-item"
                    breakLinkClassName="orders-paginate-link orders-paginate-break"
                    disabledLinkClassName="orders-paginate-link--disabled"
                />
            </div>
        </div>
    );
};

export default OrdersComponent;