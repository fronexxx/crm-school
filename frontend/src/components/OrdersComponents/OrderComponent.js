import './Order.css';
import {useEffect, useState} from "react";
import {ordersService} from "../../services/ordersService";
import EditComponent from "../EditComponent/EditComponent";

const OrderComponent = ({order, groups, onUpdated, currentUserId}) => {
    const group = groups.find(group => group.id === order.group)
    const [clicked, setClicked] = useState(false);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [isModelOpen, setIsModalOpen] = useState(false);


    const handleOnClick = () => setClicked(prev => !prev);

    const isMine =  !order.manager || order.manager?.id === currentUserId;

    const openModelButton = () => {
        setIsModalOpen(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setError(null)
            const created = await ordersService.addComment(order.id, {text})
            setComments(prev => [created, ...prev]);
            setText('')
            onUpdated()
        } catch (e) {
            setError(e.message)
        }
    };

    const handleSave = async (id, data) => {
        await ordersService.updateOrder(id, data);
        setIsModalOpen(false);
        onUpdated();
    };




    useEffect(() => {
        if (!clicked) return;

        ordersService.getComments(order.id)
            .then(value => {
                setComments(value)
            })
            .catch(e => setError(e.message));

    }, [clicked, order.id])


    return (
        <>
            <tr className={clicked ? 'orders-row orders-row--open' : 'orders-row'} onClick={handleOnClick}>
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
            {clicked && (
                <tr className="orders-details-row">
                    <td className="orders-details-cell" colSpan={15}>
                        <div className="orders-details">
                            <div className="orders-info">
                                <p className="orders-info-text">msg: {order.msg ?? '-'}</p>
                                <p className="orders-info-text">utm: {order.utm ?? '-'}</p>
                            </div>
                            <div className="orders-comments">
                                {comments.slice(0, 3).map(comment => (
                                    <div className="orders-comment" key={comment.id}>
                                        <span className="orders-comment-text">{comment.text}</span>
                                        <span className="orders-comment-author">{comment.author ?? '-'}</span>
                                        <span className="orders-comment-date">{new Date(comment.created_at).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="orders-comment-form">
                                <form className="orders-form" onSubmit={handleSubmit}>
                                    <input className="orders-form-input" type="text" value={text} onChange={(e) => setText(e.target.value)}/>
                                    <button className="orders-form-submit" disabled={!text.trim()}>Submit</button>
                                </form>
                                <button
                                    className="orders-edit-btn"
                                    disabled={!isMine}
                                    title={!isMine ? '' : 'Редагувати може лише менеджер, за яким закріплена заявка'}
                                    onClick={openModelButton}
                                >
                                    Edit
                                </button>
                                {error && <div className="orders-form-error">{error}</div>}
                            </div>
                        </div>
                    </td>
                    {isModelOpen && (
                        <div>
                            <EditComponent order={order} onClose={() => setIsModalOpen(false)} onSave={handleSave} groups={groups}/>
                        </div>
                    )}
                </tr>
            )}
        </>
    );
};

export default OrderComponent;