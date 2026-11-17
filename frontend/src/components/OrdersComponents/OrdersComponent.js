import {useSearchParams} from "react-router-dom";
import {useCallback, useEffect, useRef, useState} from "react";
import {ordersService} from "../../services/ordersService";
import OrderComponent from "./OrderComponent";
import './Orders.css'
import ReactPaginate from "react-paginate";
import FilterComponent from "../FilterComponent/FilterComponent";
import {useUser} from "../UserContext/UserProvider";
import {useRequest} from "../../hooks/useRequest";

const OrdersComponent = () => {
    const [orders, setOrders] = useState([]);
    const [groups, setGroups] = useState([])
    const [pageInfo, setPageInfo] = useState({
        totalItems: 0,
        totalPages: 0,
        prev: false,
        next: false
    });
    const {error, run} = useRequest();
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get('page') || 1) - 1;
    const order = searchParams.get('order');
    const {me} = useUser();
    const [openOrderId, setOpenOrderId] = useState(null);

    const toggleOrder = (id) => setOpenOrderId(prev => prev === id ? null : id);

    const controllerRef = useRef(null);

    const loadOrders = useCallback(async ({silent = false} = {}) => {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        if (!silent) {
            setLoading(true);
            setOpenOrderId(null);
        }

        const value = await run(() => ordersService.getAllOrders(Object.fromEntries(searchParams), controller.signal));

        if (controller.signal.aborted) return;

        if (value) {
            setPageInfo({
                totalItems: value.total_items,
                totalPages: value.total_pages,
                prev: value.prev,
                next: value.next
            });

            setOrders(value.data);

        } else if (!silent) {
            setOrders([]);
        }

        setLoading(false);


    }, [searchParams, run]);

    const loadGroups = async () => {
        const value = await run(() => ordersService.getGroups());

        if (value === undefined) return;

        setGroups(value);
    };

    const sortBy = (field) => setSearchParams(prev => {
        prev.set('order', prev.get('order') === field ? `-${field}` : field)
        prev.set('page', '1');
        return prev;
    });

    const mark = (field) => order === field ? '↑' : order === `-${field}` ? '↓' : '';

    useEffect(() => {
        void loadOrders();
        return () => controllerRef.current?.abort();
    }, [loadOrders])

    useEffect(() => {
        void loadGroups()
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


    return (
        <div className="orders-page">
            <FilterComponent groups={groups}/>
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
                    <th className="orders-sortable" onClick={() => sortBy('already_paid')}>alreadyPaid {mark('alreadyPaid')}</th>
                    <th className="orders-sortable" onClick={() => sortBy('group')}>group {mark('group')}</th>
                    <th className="orders-sortable" onClick={() => sortBy('created_at')}>created_at {mark('created_at')}</th>
                    <th className="orders-sortable" onClick={() => sortBy('manager')}>manager {mark('manager')}</th>
                </tr>
                </thead>
                <tbody>

                {error && (
                    <tr className="orders-error-row">
                        <td className="orders-error-cell" colSpan={15}>
                            <div className="orders-error">
                                <span className="orders-error-text">{error}</span>
                                <div className="orders-error-actions">
                                    <button className="orders-error-btn" type="button" onClick={() => loadOrders()}>Try again</button>
                                    <button className="orders-error-btn orders-error-btn--secondary" type="button" onClick={() => {
                                        window.location.href = '/orders';
                                    }}>Reset
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                )}

                {loading
                    ? <tr>
                        <td className="orders-loading" colSpan={15}>Loading...</td>
                    </tr>
                    : orders.map(order => <OrderComponent key={order.id} order={order} currentUserId={me?.id} groups={groups} isOpen={openOrderId === order.id}
                                                          onToggle={() => toggleOrder(order.id)} onGroupCreated={loadGroups}
                                                          onUpdated={() => loadOrders({silent: true})}/>)}
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