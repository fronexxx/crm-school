import {useSearchParams} from "react-router-dom";
import {useForm, useWatch} from "react-hook-form";
import {useEffect, useState} from "react";
import {ordersService} from "../../services/ordersService";
import './Filter.css';
import {FiFile, FiRefreshCcw} from "react-icons/fi";

const FilterComponent = ({loadOrders, groups}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [choices, setChoices] = useState(null);

    const {register, control, reset} = useForm({
        defaultValues: {
            name: searchParams.get('name') || '',
            surname: searchParams.get('surname') || '',
            email: searchParams.get('email') || '',
            phone: searchParams.get('phone') || '',
            age: searchParams.get('age') || '',
            course: searchParams.get('course') || '',
            course_format: searchParams.get('course_format') || '',
            course_type: searchParams.get('course_type') || '',
            status: searchParams.get('status') || '',
            sum: searchParams.get('sum') || '',
            already_paid: searchParams.get('already_paid') || '',
            group: searchParams.get('group') || '',
            start_date: searchParams.get('start_date') || '',
            end_date: searchParams.get('end_date') || '',
            my: searchParams.get('my') || ''
        },
    });

    const filters = useWatch({control});

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearchParams(prev => {
                const params = new URLSearchParams(prev);

                Object.entries(filters).forEach(([key, value]) => {
                    const valueString = String(value).trim().toLowerCase();
                    if (valueString && valueString !== 'false') {
                        params.set(key, value);
                        if (params.get('page')) {
                            params.delete('page');
                        }
                    } else {
                        params.delete(key);
                    }
                });
                return params;
            });
        }, 800);
        return () => clearTimeout(timeout);
    }, [filters]);

    useEffect(() => {
        ordersService.getOrderChoices().then(value => {
            setChoices(value)
        });
    }, []);

    useEffect(() => {
        loadOrders();
    }, [searchParams])

    return (
        <div className="orders-filters">
            <form className="orders-filters-form">
                <input className="orders-filter-input" type="text" {...register('name')} placeholder="Name"/>
                <input className="orders-filter-input" type="text" {...register('surname')} placeholder="Surname"/>
                <input className="orders-filter-input" type="text" {...register('email')} placeholder="Email"/>
                <input className="orders-filter-input" type="text" {...register('phone')} placeholder="Phone"/>
                <input className="orders-filter-input" type="text" {...register('age')} placeholder="Age"/>
                <select className="orders-filter-select" {...register('course')}>
                    <option value="">All Courses</option>
                    {choices?.courses.map(course => (
                        <option key={course.value} value={course.value}>{course.label}</option>
                    ))}
                </select>

                <select className="orders-filter-select" {...register('course_format')}>
                    <option value="">All Course Formats</option>
                    {choices?.course_formats.map(course_format => (
                        <option key={course_format.value} value={course_format.value}>{course_format.label}</option>
                    ))}
                </select>

                <select className="orders-filter-select" {...register('course_type')}>
                    <option value="">All Course Types</option>
                    {choices?.course_types.map(course_type => (
                        <option key={course_type.value} value={course_type.value}>{course_type.label}</option>
                    ))}
                </select>

                <select className="orders-filter-select" {...register('status')}>
                    <option value="">All Statuses</option>
                    {choices?.statuses.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                </select>

                <select className="orders-filter-select" {...register('group')}>
                    <option value="">All Groups</option>
                    {groups.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                </select>

                <input
                    className="orders-filter-input"
                    type={filters.start_date ? "date" : "text"}
                    placeholder="Start date"
                    onFocus={(e) => e.target.type = 'date'}
                    onBlur={(e) => {
                        if (!e.target.value) e.target.type = 'text';
                    }}
                    {...register('start_date')}
                />

                <input
                    className="orders-filter-input"
                    type={filters.end_date ? "date" : "text"}
                    placeholder="End date"
                    onFocus={(e) => e.target.type = 'date'}
                    onBlur={(e) => {
                        if (!e.target.value) e.target.type = 'text';
                    }}
                    {...register('end_date')}
                />

                <div className="orders-filter-right-group">
                    <label className="orders-filter-checkbox" htmlFor="my-order">
                        <input id="my-order" type="checkbox" {...register('my')}/>
                        <span>My</span>
                    </label>

                    <div className="orders-filter-actions">
                        <button className="orders-filter-button orders-filter-button--reset" type="button" title="reload page" onClick={() => {
                            reset();
                            window.location.href = '/orders';
                        }}>
                            <FiRefreshCcw/>
                        </button>

                        <button className="orders-filter-button" type="button" title="Convert to excel">
                            <FiFile/>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FilterComponent;