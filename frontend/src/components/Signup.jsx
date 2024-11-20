import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'
import PasswordChecklist from "react-password-checklist"
import { Form, Input,Button,Checkbox } from 'antd'

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [styling, setStyling] = useState('d-none');
    const [agree,setAgree] = useState()
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') setUsername(value);
        if (name === 'email') setEmail(value);
        if (name === 'password') {
            setPassword(value);
            setStyling(value ? 'd-block' : 'd-none');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate({ username, email, password });
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                console.log('Submitting data to API:', { username, email, password });
                const response = await axios.post('http://localhost:5002/api/signup', { username, email, password });
                console.log('API response:', response.data);
                navigate('/login');
            } catch (error) {
                console.error('Signup error:', error.response?.data?.error || error.message);
                alert('Signup failed. Please try again.');
            }
        }
    };



    const validate = (values) => {
        const errors = {};

        if (!values.username) {
            errors.username = 'Username is required';
        }

        if (!values.email) {
            errors.email = 'Email is required';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.email)) {
            errors.email = 'Email is not valid';
        }
        if (!values.password) {
            errors.password = 'Password is required';
        } else if (values.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        return errors;
    };
    function handleChangedata(e){
        const {name,value} = e.target
       if(name==="username") setUsername(value)
        if(name==="email") setEmail(value)
            if(name === "password") setPassword(value)
    }
    function handleFinish(values){
console.log(values)
    }

    return (
        <div className="bg-secondary " style={{ 'height': "100vh" }}>
            <div className=" d-flex flex-column justify-content-center">

               <div className='border-2 d-flex flex-column justify-content-center align-items-center'>
                <h2>SignUp Here...</h2>
             
               </div>
                <h2 className="">Sign up </h2>
                <form className="w-50" onSubmit={handleSubmit} >
                    <input type="hidden" name="remember" value="true" />
                    <div className="">
                        <div className=''>
                            <label htmlFor="username" className="">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                className="form-control"
                                placeholder="Username"
                                value={username}
                                onChange={handleChange}
                            />
                        </div>
                        <span className='text-danger'>{errors.username}</span>
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"

                                className="form-control"
                                placeholder="Email address"
                                value={email}
                                onChange={handleChange}
                            />
                        </div>
                        <span className='text-danger'>{errors.email}</span>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"

                                className="form-control"
                                placeholder="Password"

                                value={password}
                                onChange={handleChange}
                            />

                            <PasswordChecklist
                                className={styling}
                                rules={["minLength", "specialChar", "number", "capital"]}
                                minLength={6}
                                value={password}

                            />
                        </div>
                        <span className='text-danger'>{errors.password}</span>
                    </div>

                    <div className='my-2'>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Sign up
                        </button>
                        <Link className='btn btn-light mx-2' to="/login">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;

export function LoginDetails() {

    useEffect(() => {

    }, [])


    return (
        <div className=''>
            <h2>helo</h2>
            <div>

            </div>
        </div>
    )
}
