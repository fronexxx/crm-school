import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {ordersService} from "../../services/ordersService";
import {createPortal} from "react-dom";
import './Edit.css';
import GroupForm from "./GroupForm";

const EditComponent = ({order, onClose, onSave, groups, onGroupCreated}) => {
    const [choices, setChoices] = useState(null);
    const numberOrNull = (v) => v === '' ? null : Number(v);

    const {handleSubmit, register, setValue, setError, formState: {errors, isSubmitting}} = useForm({
        defaultValues: {
            name: order.name,
            surname: order.surname,
            email: order.email,
            phone: order.phone,
            age: order.age,
            course: order.course,
            course_format: order.course_format,
            course_type: order.course_type,
            status: order.status,
            sum: order.sum,
            already_paid: order.already_paid,
            group: order.group
        }
    });

    const editUpdatedData = async (data) => {
        try {
            await onSave(order.id, data);
        } catch (e) {
            setError('root', {message: e.message});
        }
    };


    useEffect(() => {
        ordersService.getOrderChoices().then(value => {
            setChoices(value)
        }).catch(e => setError('root', {message: e.message}))
    }, []);

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return createPortal(
        <div className="edit-overlay" onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="edit-modal">
                {!choices ? (
                    <p className="edit-loading">Loading...</p>
                ) : (
                    <form className="edit-form" onSubmit={handleSubmit(editUpdatedData)} noValidate>


                        <GroupForm onGroupCreated={onGroupCreated} register={register} setValue={setValue} groups={groups}/>

                        <div className="edit-field">
                            <label className="edit-label" htmlFor="status">Status</label>
                            <select id="status" className="edit-control" {...register('status')}>
                                {choices?.statuses.map(status => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="edit-field">
                            <label className="edit-label" htmlFor="name">Name</label>
                            <input id="name" className="edit-control" type="text" placeholder="Name" {...register('name', {required: 'Enter your name'})}/>
                            {errors.name && <p className="edit-error">{errors.name.message}</p>}
                        </div>

                        <div className="edit-field">
                            <label className="edit-label" htmlFor="sum">Sum</label>
                            <input id="sum" className="edit-control" type="text" placeholder="Sum" {...register('sum', {setValueAs: numberOrNull})}/>
                        </div>

                        <div className="edit-field">
                            <label className="edit-label" htmlFor="surname">Surname</label>
                            <input id="surname" className="edit-control" type="text" placeholder="Surname" {...register('surname', {required: 'Enter your surname'})}/>
                            {errors.surname && <p className="edit-error">{errors.surname.message}</p>}
                        </div>

                        <div className="edit-field">
                            <label className="edit-label" htmlFor="already_paid">Already Paid</label>
                            <input id="already_paid" className="edit-control" type="text"
                                   placeholder="Already Paid" {...register('already_paid', {setValueAs: numberOrNull})}/>
                        </div>

                        <div className="edit-field">
                            <label className="edit-label" htmlFor="email">Email</label>
                            <input id="email" className="edit-control" type="email" placeholder="Email" {...register('email')}/>
                        </div>

                        <div className="edit-field">
                            <label className="edit-label" htmlFor="course">Course</label>
                            <select id="course" className="edit-control" {...register('course')}>
                                <option value="">All Courses</option>
                                {choices?.courses.map(course => (
                                    <option key={course.value} value={course.value}>{course.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="edit-field">
                            <label className="edit-label" htmlFor="phone">Phone</label>
                            <input id="phone" className="edit-control" type="tel" placeholder="Phone" {...register('phone')}/>
                        </div>

                        <div className="edit-field">
                            <label className="edit-label" htmlFor="course_format">Course Format</label>
                            <select id="course_format" className="edit-control" {...register('course_format')}>
                                <option value="">All Course Formats</option>
                                {choices?.course_formats.map(course_format => (
                                    <option key={course_format.value} value={course_format.value}>{course_format.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="edit-field">
                            <label className="edit-label" htmlFor="age">Age</label>
                            <input id="age" className="edit-control" type="text" placeholder="Age" {...register('age')}/>
                        </div>

                        <div className="edit-field">
                            <label className="edit-label" htmlFor="course_type">Course Type</label>
                            <select id="course_type" className="edit-control" {...register('course_type')}>
                                <option value="">All Course Types</option>
                                {choices?.course_types.map(course_type => (
                                    <option key={course_type.value} value={course_type.value}>{course_type.label}</option>
                                ))}
                            </select>
                        </div>


                        {errors.root && <p className="edit-error">{errors.root.message}</p>}

                        <div className="edit-actions">
                            <button className="edit-btn edit-btn--secondary" type="button" onClick={onClose}>Cancel</button>
                            <button className="edit-btn edit-btn--primary" type="submit" disabled={isSubmitting}>Save</button>
                        </div>
                    </form>
                )}
            </div>
        </div>,
        document.body
    );
};

export default EditComponent;
