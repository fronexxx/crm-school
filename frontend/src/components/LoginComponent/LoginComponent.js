import {useForm} from "react-hook-form";
import {authService} from "../../services/authService";
import {useNavigate} from "react-router-dom";
import './LoginCard.css';

const LoginComponent = () => {
    const {handleSubmit, register, setError, reset, formState: {errors, isSubmitting}} = useForm();
    const navigate = useNavigate();

    const onSubmit = async (user) => {
        try {
            await authService.login(user);
            navigate('/orders');
        } catch (e) {
            setError('root', {
                message: e.status === 401 ? 'Невірний email або пароль' : e.message
            });
        }
    };

    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleSubmit(onSubmit)} noValidate>
                <h1 className="login-title">CRM School</h1>
                <p className="login-subtitle">Login to continue</p>

                <div className="login-field">
                    <label className="login-label" htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        autoComplete="username"
                        className={errors.email ? 'login-input login-input--invalid' : 'login-input'}
                        {...register('email', {required: 'Введіть email'})}
                    />
                    {errors.email && <p className="login-field-error">{errors.email.message}</p>}
                </div>

                <div className="login-field">
                    <label className="login-label" htmlFor="login-password">Password</label>
                    <input
                        id="login-password"
                        type="password"
                        autoComplete="current-password"
                        className={errors.password ? 'login-input login-input--invalid' : 'login-input'}
                        {...register('password', {required: 'Введіть пароль'})}
                    />
                    {errors.password && <p className="login-field-error">{errors.password.message}</p>}
                </div>

                {errors.root && <div className="login-form-error">{errors.root.message}</div>}

                <div className="login-actions">
                    <button type="submit" className="login-btn login-btn--primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in…' : 'Login'}
                    </button>
                    <button type="button" className="login-btn login-btn--secondary" onClick={() => reset()}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginComponent;