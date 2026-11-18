import {formDate} from "../../utils/formDate";
import './Manager.css';

const ManagerComponent = ({manager}) => {
    return (
        <div className="manager-card">
            <div className="manager-info">
                <p className="manager-line"><span className="manager-label">id</span>{manager.id}</p>
                <p className="manager-line"><span className="manager-label">email</span>{manager.email}</p>
                <p className="manager-line"><span className="manager-label">name</span>{manager.first_name}</p>
                <p className="manager-line"><span className="manager-label">surname</span>{manager.last_name}</p>
                <p className="manager-line">
                    <span className="manager-label">is_active</span>
                    <span className={manager.is_active ? 'manager-badge manager-badge--ok' : 'manager-badge manager-badge--warn'}>{String(manager.is_active)}</span>
                </p>
                <p className="manager-line">
                    <span className="manager-label">is_banned</span>
                    <span className={manager.is_banned ? 'manager-badge manager-badge--bad' : 'manager-badge manager-badge--muted'}>{String(manager.is_banned)}</span>
                </p>
                <p className="manager-line"><span className="manager-label">last_login</span>{formDate(manager.last_login)}</p>
            </div>
            <div className="manager-total">
                <span className="manager-total-label">total</span>
                <span className="manager-total-value">{manager.total}</span>
            </div>
            <div className="manager-actions">
                <button className="manager-btn manager-btn--activate">ACTIVATE</button>
                <button className="manager-btn manager-btn--ban">BAN</button>
                <button className="manager-btn manager-btn--unban">UNBAN</button>
            </div>
        </div>
    );
};

export default ManagerComponent;