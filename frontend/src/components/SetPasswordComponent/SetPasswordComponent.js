import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import '../LoginComponent/LoginCard.css';

const SetPasswordComponent = ({title, onSubmitPassword}) => {
    const navigate = useNavigate();
    const {handleSubmit, register, getValues, setError, formState: {errors, isSubmitting}} = useForm();

    const onSubmit = async (data) => {
        try {
            await onSubmitPassword(data);
            navigate('/', {replace: true});
        } catch (e) {
            setError('root', {message: e.message})
        }
    };

    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleSubmit(onSubmit)} noValidate>
                <h1 className="login-title">{title}</h1>

                <div className="login-field">
                    <input
                        className={errors.password ? 'login-input login-input--invalid' : 'login-input'}
                        type="password"
                        placeholder="New password"
                        autoComplete="new-password"
                        {...register('password', {required: 'Enter a password'})}
                    />
                    {errors.password && <p className="login-field-error">{errors.password.message}</p>}
                </div>

                <div className="login-field">
                    <input
                        className={errors.confirm_password ? 'login-input login-input--invalid' : 'login-input'}
                        type="password"
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        {...register('confirm_password', {
                            required: 'Confirm the password',
                            validate: (value) => value === getValues('password') || 'Passwords do not match',
                        })}
                    />
                    {errors.confirm_password && <p className="login-field-error">{errors.confirm_password.message}</p>}
                </div>

                {errors.root && <div className="login-form-error">{errors.root.message}</div>}

                <div className="login-actions">
                    <button className="login-btn login-btn--primary" type="submit" disabled={isSubmitting}>Save password</button>
                </div>
            </form>
        </div>
    );
};

export default SetPasswordComponent;