import {createContext, useContext, useEffect, useState} from "react";
import {managerService} from "../../services/managerService";

const UserContext = createContext({me: null, loading: true});

const UserProvider = ({children}) => {
    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(!!localStorage.getItem('tokens'))

    useEffect(() => {
        if (!localStorage.getItem('tokens')) return;

        managerService.getSelfManager()
            .then(value => setMe(value))
            .catch(() => setMe(null))
            .finally(() => setLoading(false))
    }, []);

    return <UserContext.Provider value={{me, loading}}>{children}</UserContext.Provider>
};

const useUser = () => useContext(UserContext);

export {UserProvider, useUser};