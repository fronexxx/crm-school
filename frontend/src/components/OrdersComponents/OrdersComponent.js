import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ordersService} from "../../services/ordersService";
import OrderComponent from "./OrderComponent";
import './Orders.css'
import ReactPaginate from "react-paginate";
import {authService} from "../../services/authService";
import {managerService} from "../../services/managerService";

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
    const order = searchParams.get('order');
    const [me, setMe] = useState(null);

    const loadOrders = async ({silent = false, retry = false} = {}) => {
        try {
            if (!silent) {
                setLoading(true);
                setError(null)
            }
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
                    return loadOrders({silent, retry: true});
                } catch (e) {
                    setError('Session expired. Please log in again.')
                }
            } else {
                setError(e.message)
            }
        } finally {
            if (!silent) setLoading(false)
        }
    };

    const sortBy = (field) => setSearchParams(prev => {
        prev.set('order', prev.get('order') === field ? `-${field}` : field)
        prev.set('page', '1');
        return prev;
    });

    const mark = (field) => order === field ? '↑' : order === `-${field}` ? '↓' : '';

    // const goToPage = (p) => setSearchParams(prev => {
    //     prev.set('page', p);
    //     return prev
    // });

    useEffect(() => {
        void loadOrders()
    }, [searchParams])

    useEffect(() => {
        const loadGroups = async () => {
            try {
                const value = await ordersService.getGroups();
                setGroups(value);
            } catch (e) {
                setError(e.message)
            }
        };

        void loadGroups()

    }, [])

    useEffect(() => {
        const loadMe = async () => {
            try {
                const value = await managerService.getSelfManager();
                setMe(value)
            } catch (e) {
                setError(e.message)
            }
        };

        void loadMe();
    }, []);

    const handlePageChange = (data) => {
        const page = data.selected;


        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.set('page', page + 1);
            params.delete('order');
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
                    <th className="orders-sortable" onClick={() => sortBy('id')}>id {mark('id')}</th>
                    <th className="orders-sortable" onClick={() => sortBy('name')}>name {mark('name')}</th>
                    <th className="orders-sortable" onClick={() => sortBy('surname')}>surname {mark('surname')}</th>
                    <th className="orders-sortable" onClick={() => sortBy('email')}>email {mark('email')}</th>
                    <th className="orders-sortable" onClick={() => sortBy('phone')}>phone {mark('phone')}</th>
                    <th className="orders-sortable" onClick={() => sortBy('age')}>age {mark('age')}</th>
                    <th className="orders-sortable" onClick={() => sortBy('course')}>course {mark('course')}</th>
                    <th className="orders-sortable" onClick={() => sortBy('course_format')}>course_format {mark('course_format')}</th>
                    <th className="orders-sortable" onClick={() => sortBy('course_type')}>course_type {mark('course_type')}</th>
                    <th className="orders-sortable" onClick={() => sortBy('status')}>status {mark('status')}</th>
                    <th className="orders-sortable" onClick={() => sortBy('sum')}>sum {mark('sum')}</th>
                    <th className="orders-sortable" onClick={() => sortBy('alreadyPaid')}>alreadyPaid {mark('alreadyPaid')}</th>
                    <th className="orders-sortable" onClick={() => sortBy('group')}>group {mark('group')}</th>
                    <th className="orders-sortable" onClick={() => sortBy('created_at')}>created_at {mark('created_at')}</th>
                    <th className="orders-sortable" onClick={() => sortBy('manager')}>manager {mark('manager')}</th>
                </tr>
                </thead>
                <tbody>
                {loading
                    ? <tr>
                        <td className="orders-loading" colSpan={15}>Loading...</td>
                    </tr>
                    : orders.map(order => <OrderComponent key={order.id} order={order} currentUserId={me?.id} groups={groups} onUpdated={() => loadOrders({silent: true})}/>)}
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