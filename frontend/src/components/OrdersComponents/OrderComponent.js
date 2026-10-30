import './Orders.css'

const OrderComponent = ({order, groups}) => {
    const group = groups.find(group => group.id === order.group)
    return (
        <>
            <tr className="orders-row">
                <td>{order.id}</td>
                <td>{order.name ?? '-'}</td>
                <td>{order.surname ?? '-'}</td>
                <td>{order.email ?? '-'}</td>
                <td>{order.phone ?? '-'}</td>
                <td>{order.age ?? '-'}</td>
                <td>{order.course ?? '-'}</td>
                <td>{order.course_format ?? '-'}</td>
                <td>{order.course_type ?? '-'}</td>
                <td>{order.status}</td>
                <td>{order.sum ?? '-'}</td>
                <td>{order.already_paid ?? '-'}</td>
                <td>{group?.name ?? '-'}</td>
                <td>{new Date(order.created_at).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</td>
                <td>{order.manager?.first_name ?? '-'}</td>
            </tr>
        </>
    );
};

export default OrderComponent;