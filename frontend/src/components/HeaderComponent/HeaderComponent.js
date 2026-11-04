import {useEffect, useState} from "react";
import {managerService} from "../../services/managerService";
import {authService} from "../../services/authService";
import {useLocation, useNavigate} from "react-router-dom";
import './Header.css';
import {FiLogOut, FiSettings} from "react-icons/fi";

const HeaderComponent = () => {
    const [manager, setManager] = useState({});
    const navigate = useNavigate();
    const location = useLocation();


    const notAdminPanel = location.pathname !== '/adminPanel';
    const isAdminPanel = location.pathname === '/adminPanel';
    const isAdmin = manager?.role === 'admin';

    useEffect(() => {
        managerService.getSelfManager().then(value => {
            setManager(value)
        })
    }, []);

    const handleChange = () => {
        authService.logout()
        navigate('/', {replace: true});
    };


    return (
        <div className="header">
            <div className="header-logo">
                <p className="header-logo-text">CRM - Programming School</p>
            </div>
            <div className="header-actions">
                {manager?.first_name}
                <button className="header-btn header-btn--secondary header-btn--icon" title={'logout'} onClick={handleChange}><FiLogOut/></button>
                {isAdmin && notAdminPanel && (
                    <button className="header-btn header-btn--primary header-btn--icon" title={'Admin Panel'} onClick={() => {
                        navigate('/adminPanel')
                    }}><FiSettings/></button>
                )}
                {isAdmin && isAdminPanel && (
                    <button className="header-btn header-btn--primary" onClick={() => {
                        navigate('/orders');
                    }}>Back To Orders</button>
                )}
            </div>
        </div>
    );
};

export default HeaderComponent;