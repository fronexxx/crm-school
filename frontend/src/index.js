import ReactDOM from 'react-dom/client';
import {RouterProvider} from "react-router-dom";
import {router} from "./router";
import {UserProvider} from "./components/UserContext/UserProvider";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserProvider>
        <RouterProvider router={router}/>
    </UserProvider>
);


