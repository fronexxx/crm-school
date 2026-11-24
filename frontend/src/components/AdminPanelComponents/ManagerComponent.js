import {formDate} from "../../utils/formDate";
import './Manager.css';
import {managerService} from "../../services/managerService";
import {useRequest} from "../../hooks/useRequest";
import {useState} from "react";

const ManagerComponent = ({manager, onUpdated}) => {
    const {run, error, setError} = useRequest();
    const [activationLink, setActivationLink] = useState(null);
    const [recoveryLink, setRecoveryLink] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleOnActivate = async (id) => {
        const value = await run(() => managerService.createActivationToken(id));
        if (value) {
            setActivationLink(`${window.location.origin}/activate/${value.token}`);
            setTimeout(() => setActivationLink(null), 20000);
        }

    };

    const handleActivationCopy = async () => {
        try {
            await navigator.clipboard.writeText(String(activationLink));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            setTimeout(() => setActivationLink(null), 10000);
        } catch {
            setError('Could not copy the link');
        }
    };

    const handleOnRecoveryPassword = async (id) => {
        const value = await run(() => managerService.recoveryToken(id));

        if (value) {
            setRecoveryLink(`${window.location.origin}/recovery/${value.recovery_token}`);
            setTimeout(() => setRecoveryLink(null), 20000);
        }
    };

    const handleRecoveryCopy = async () => {
        try {
            await navigator.clipboard.writeText(String(recoveryLink));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            setTimeout(() => setRecoveryLink(null), 10000);
        } catch {
            setError('Could not copy the link');
        }
    };

    const handleOnBan = async (id) => {
        await run(() => managerService.banManager(id));
        onUpdated();
    };

    const handleOnUnBan = async (id) => {
        await run(() => managerService.unbanManager(id));
        onUpdated();
    };

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
                {manager.is_active
                    ? recoveryLink
                        ? <button className="manager-btn manager-btn--activate" type="button" onClick={handleRecoveryCopy}>
                            {copied ? 'COPIED' : 'COPY TO CLIPBOARD'}
                        </button>
                        : <button className="manager-btn manager-btn--activate" type="button" onClick={() => handleOnRecoveryPassword(manager.id)}>
                            RECOVERY PASSWORD
                        </button>
                    : activationLink
                        ? <button className="manager-btn manager-btn--activate" type="button" onClick={handleActivationCopy}>
                            {copied ? 'COPIED' : 'COPY TO CLIPBOARD'}
                        </button>
                        : <button className="manager-btn manager-btn--activate" type="button" onClick={() => handleOnActivate(manager.id)}>
                            ACTIVATE
                        </button>
                }
                <button className="manager-btn manager-btn--ban" type="button" onClick={() => handleOnBan(manager.id)}>BAN</button>
                <button className="manager-btn manager-btn--unban" type="button" onClick={() => handleOnUnBan(manager.id)}>UNBAN</button>
            </div>
            {error && <p className="manager-error">{error}</p>}
        </div>
    );
};

export default ManagerComponent;