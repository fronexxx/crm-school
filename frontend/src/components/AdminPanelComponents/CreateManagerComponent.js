import {useForm} from "react-hook-form";
import {createPortal} from "react-dom";
import './CreateManager.css';
import {useEffect} from "react";

const CreateManagerComponent = ({onSave, onCancel}) => {
    const {register, handleSubmit, setError, formState: {isSubmitting, errors}} = useForm();

    const saveManager = async (data) => {
        try {
            await onSave(data)
        } catch (e) {
            setError('root', {message: e.message})
        }
    };

     useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return createPortal(
        <div className="create-overlay" onMouseDown={(e) => {
            if (e.target === e.currentTarget) onCancel()
        }}>
            <div className="create-modal">
                <h2 className="create-title">Create manager</h2>
                <form className="create-form" onSubmit={handleSubmit(saveManager)} noValidate>
                    <div className="create-fields">
                        <input className="create-control" type="email" {...register('email')} placeholder={'Email'} required/>
                        <input className="create-control" type="text" {...register('first_name')} placeholder={'Name'} required/>
                        <input className="create-control" type="text" {...register('last_name')} placeholder={'Surname'} required/>
                    </div>
                    {errors.root && <p className="create-error">{errors.root.message}</p>}
                    <div className="create-actions">
                        <button className="create-btn create-btn--secondary" type="button" onClick={onCancel}>Cancel</button>
                        <button className="create-btn create-btn--primary" disabled={isSubmitting}>Create</button>
                    </div>
                </form>
            </div>

        </div>,
        document.body
    );
};

export default CreateManagerComponent;