import {useEffect, useState} from "react";
import {managerService} from "../../services/managerService";
import {authService} from "../../services/authService";
import {useNavigate} from "react-router-dom";

const HeaderComponent = () => {
    const [manager, setManager] = useState({});
    const navigate = useNavigate();

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
        <div>
            <div>
                <p>Logo</p>
            </div>
            <div>
                {manager?.first_name}
                <button onClick={handleChange}>logout</button>
                {isAdmin && (
                    <button onClick={() => window.location = '/adminPanel'}>AdminPanel</button>
                )}
            </div>
        </div>
    );
};

export default HeaderComponent;