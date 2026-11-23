import {useCallback, useEffect, useState} from "react";
import {useRequest} from "../../hooks/useRequest";
import {managerService} from "../../services/managerService";
import ManagerComponent from "./ManagerComponent";
import './Managers.css';
import CreateManagerComponent from "./CreateManagerComponent";

const ManagersComponent = () => {
    const [managers, setManagers] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stat, setStat] = useState({});
    const [pageInfo, setPageInfo] = useState({
        prev: false,
        next: false
    });
    const {run, error} = useRequest();

    const openModalButton = () => {
        setIsModalOpen(true);
    };

    const loadManagers = useCallback(async ({silent = false} = {}) => {
        if (!silent) {
            setLoading(true);
        }

        const value = await run(() => managerService.getAllManagers(page));
        if (value) {
            setPageInfo({
                prev: value.prev,
                next: value.next
            });

            setManagers(value.managers);
        } else if (!silent){
            setManagers([]);
        }

        if (!silent) {
            setLoading(false);
        }

    }, [page, run])

    const handleSave = async (data) => {
        await managerService.createManager(data);
        setIsModalOpen(false);
        void loadManagers()
    };

    useEffect(() => {
        void loadManagers()
    }, [loadManagers]);


    useEffect(() => {
        const allStatistic = async () => {
            const value = await run(() => managerService.getAllStatistic());
            if (value) {
                setStat(value);
            } else {
                setStat({});
            }
        };

        void allStatistic()
    }, []);


    const changePage = (p) => {
        setPage(p);
        window.scroll({top: 0, behavior: 'smooth'});
    };

    return (
        <div className="managers-page">
            <div className="managers-content">
                <div className="managers-stats">
                    <h2 className="managers-stats-title">Orders statistic</h2>
                    <div className="managers-stats-list">
                        <span className="managers-stat">total: {stat.total}</span>
                        <span className="managers-stat">In work: {stat.in_work}</span>
                        <span className="managers-stat">Agree: {stat.agree}</span>
                        <span className="managers-stat">Disagree: {stat.disagree}</span>
                        <span className="managers-stat">Dubbing: {stat.dubbing}</span>
                        <span className="managers-stat">New: {stat.new}</span>
                    </div>
                </div>

                <div className="managers-toolbar">
                    <button className="managers-create" type="button" onClick={openModalButton}>Create</button>
                </div>

                {error && (
                    <div className="managers-error">
                        <div className="managers-error-body">
                            <span className="managers-error-text">{error}</span>
                            <div className="managers-error-actions">
                                <button className="managers-error-btn" type="button" onClick={() => loadManagers()}>Try again</button>
                                <button className="managers-error-btn managers-error-btn--secondary" type="button"
                                        onClick={() => window.location.href = '/adminPanel'}>Reset
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="managers-list">
                    {loading ?
                        <div className="managers-loading">
                            <span>Loading...</span>
                        </div>
                        : managers.map(manager => <ManagerComponent key={manager.id} manager={manager} onUpdated={() => loadManagers({silent: true})}/>)
                    }
                </div>

                <div className="managers-pagination">
                    <button className="managers-btn" disabled={!pageInfo.prev} onClick={() => changePage(page - 1)}>
                        prev
                    </button>
                    <button className="managers-btn" disabled={!pageInfo.next} onClick={() => changePage(page + 1)}>
                        next
                    </button>
                </div>
            </div>
            {isModalOpen && (
                <CreateManagerComponent onSave={handleSave} onCancel={() => setIsModalOpen(false)}/>
            )}
        </div>
    );
};

export default ManagersComponent;