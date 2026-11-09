import {useState} from "react";
import {ordersService} from "../../services/ordersService";
import './Edit.css';

const GroupForm = ({onGroupCreated, groups, register, setValue}) => {
    const [adding, setAdding] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState(null);

    const onClose = () => {
        setAdding(false);
        setName('');
        setError(null)
    };

    const handleAdd = async () => {
        const groupName = name.trim();

        if (!groupName) {
            setError('This field can not be empty');
            return;
        }

        try {
            const group = await ordersService.createGroups({name: groupName});
            await onGroupCreated();
            setValue('group', group.id);
            onClose();
        } catch (e) {
            setError(e.message)
        }

    }

    if (adding) {
        return (
            <div className="edit-field">
                <label className="edit-label" htmlFor="new-group">Group</label>
                <input id="new-group" className="edit-control" type="text" placeholder={'Group Name'} value={name} onChange={(e) => setName(e.target.value)}/>
                {error && <p className="edit-error">{error}</p>}
                <div className="edit-group-actions">
                    <button className="edit-btn edit-btn--primary" type={'button'} onClick={handleAdd}>Add</button>
                    <button className="edit-btn edit-btn--secondary" type={'button'} onClick={onClose}>Select</button>

                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="edit-field">
                <label className="edit-label" htmlFor="group">Group</label>
                <select id="group" className="edit-control" {...register('group')}>
                    <option value="">All Groups</option>
                    {groups.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                </select>
                <button className="edit-btn edit-btn--secondary" type={'button'} onClick={() => setAdding(true)}>Add Group</button>
            </div>
        </div>
    );
};

export default GroupForm;