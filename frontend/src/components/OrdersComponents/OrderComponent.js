import './Order.css';
import {useEffect, useState} from "react";
import {ordersService} from "../../services/ordersService";
import EditComponent from "../EditComponent/EditComponent";
import {formDate, formDateTime} from "../../utils/formDate";
import {useRequest} from "../../hooks/useRequest";

const OrderComponent = ({order, groups, onUpdated, currentUserId, onGroupCreated, isOpen, onToggle}) => {
    const group = groups.find(group => group.id === order.group)
    const [commentsLoaded, setCommentsLoaded] = useState(false);
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [isModelOpen, setIsModalOpen] = useState(false);
    const {error, run} = useRequest();


    const isMine = !order.manager || order.manager?.id === currentUserId;

    const openModelButton = () => {
        setIsModalOpen(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const created = await run(() => ordersService.addComment(order.id, {text}));

        if (created) {
            setComments(prev => [created, ...prev]);
            setText('')
            onUpdated()
        }
    };

    const handleSave = async (id, data) => {
        await ordersService.updateOrder(id, data);
        setIsModalOpen(false);
        onUpdated();
    };


    useEffect(() => {
        if (!isOpen || commentsLoaded) return;

        const loadComments = async () => {
            const value = await run(() => ordersService.getComments(order.id));
            if (value === undefined) return;

            setComments(value);
            setCommentsLoaded(true);
        };

        void loadComments()

    }, [isOpen, commentsLoaded, order.id, run]);


    return (
        <>
            <tr className={isOpen ? 'orders-row orders-row--open' : 'orders-row'} onClick={onToggle}>
                <td>{order.id}</td>
                <td>{order.name || '-'}</td>
                <td>{order.surname || '-'}</td>
                <td>{order.email || '-'}</td>
                <td>{order.phone ?? '-'}</td>
                <td>{order.age ?? '-'}</td>
                <td>{order.course || '-'}</td>
                <td>{order.course_format || '-'}</td>
                <td>{order.course_type || '-'}</td>
                <td>{order.status ?? '-'}</td>
                <td>{order.sum ?? '-'}</td>
                <td>{order.already_paid ?? '-'}</td>
                <td>{group?.name ?? '-'}</td>
                <td>{formDate(order.created_at)}</td>
                <td>{order.manager?.first_name ?? '-'}</td>
            </tr>
            {isOpen && (
                <tr className="orders-details-row">
                    <td className="orders-details-cell" colSpan={15}>
                        <div className="orders-details">
                            <div className="orders-info">
                                <p className="orders-info-text">msg: {order.msg ?? '-'}</p>
                                <p className="orders-info-text">utm: {order.utm ?? '-'}</p>
                            </div>
                            <div className="orders-comments">
                                {comments.map(comment => (
                                    <div className="orders-comment" key={comment.id}>
                                        <span className="orders-comment-text">{comment.text}</span>
                                        <span className="orders-comment-author">{comment.author ?? '-'}</span>
                                        <span className="orders-comment-date">{formDateTime(comment.created_at)}</span>
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
                                    onClick={openModelButton}
                                >
                                    Edit
                                </button>
                                {error && <div className="orders-form-error">{error}</div>}
                            </div>
                        </div>
                    </td>
                    {isModelOpen && (
                            <EditComponent order={order} onClose={() => setIsModalOpen(false)} onSave={handleSave} groups={groups} onGroupCreated={onGroupCreated}/>
                    )}
                </tr>
            )}
        </>
    );
};

export default OrderComponent;