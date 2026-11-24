import {useParams} from "react-router-dom";
import SetPasswordComponent from "../SetPasswordComponent/SetPasswordComponent";
import {managerService} from "../../services/managerService";

const RecoveryPasswordComponent = () => {
    const {recoveryToken} = useParams();

    return (
        <SetPasswordComponent
            title="Recover Password"
            onSubmitPassword={(data) => managerService.recoveryPassword(recoveryToken, data)}
        />
    );
};

export default RecoveryPasswordComponent;