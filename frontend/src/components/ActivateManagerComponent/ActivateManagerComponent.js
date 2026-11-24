import SetPasswordComponent from "../SetPasswordComponent/SetPasswordComponent";
import {useParams} from "react-router-dom";
import {managerService} from "../../services/managerService";

const ActivateManagerComponent = () => {
    const {token} = useParams();

    return (
        <SetPasswordComponent
            title="Set Password"
            onSubmitPassword={(data) => managerService.activateManager(token, data)}
        />
    );
};

export default ActivateManagerComponent;