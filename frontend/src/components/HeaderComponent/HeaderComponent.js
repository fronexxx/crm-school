import {authService} from "../../services/authService";
import {useLocation, useNavigate} from "react-router-dom";
import './Header.css';
import {FiLogOut, FiSettings} from "react-icons/fi";
import {useUser} from "../UserContext/UserProvider";

const HeaderComponent = () => {
    const {me: manager} = useUser();
    const navigate = useNavigate();
    const location = useLocation();


    const notAdminPanel = location.pathname !== '/adminPanel';
    const isAdminPanel = location.pathname === '/adminPanel';
    const isAdmin = manager?.role === 'admin';


    const handleChange = () => {
        authService.logout()
        window.location.href = '/';
    };


    return (
        <div className="header">
            <div className="header-logo">
                <p className="header-logo-text" onClick={() => {
                    window.location.href = '/orders';
                }}>CRM - Programming School</p>
            </div>
            <div className="header-actions">
                {manager?.first_name}
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
                <button className="header-btn header-btn--secondary header-btn--icon" title={'logout'} onClick={handleChange}><FiLogOut/></button>
            </div>
        </div>
    );
};

export default HeaderComponent;