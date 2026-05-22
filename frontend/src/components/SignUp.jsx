import React, { useState, useEffect } from 'react'
import './App.css'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from './features/userSlice'


const SignUp = () => {

    const dispatch = useDispatch()
    const isAuthenticated = useSelector(state => state.user.isAuthenticated)

    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated && !false) {
            navigate('/home')
        }
    }, [isAuthenticated])

    const [input, setInput] = useState({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            age: null,
            gender: ""
        })



    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(registerUser(input));
        setInput({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            age: null,
            gender: ""
        })
        navigate('/login')
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        // console.log(name, value)
        setInput({
            ...input,
            [name]: value
        })
    }
    return (
        <div className="form-wrapper">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>{false ? "Update Account" : "Create Account"}</h2>

                <div className="input-group">
                    <label>First Name</label>
                    <input
                        name='firstName'
                        type="text"
                        value={input?.firstName}
                        onChange={handleChange}
                        placeholder="John"
                    />
                </div>

                <div className="input-group">
                    <label>Last Name</label>
                    <input
                        name='lastName'
                        type="text"
                        value={input?.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                    />
                </div>

                <div className="input-group">
                    <label>Email Address</label>
                    <input
                        name='email'
                        type="email"
                        value={input?.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                    />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input
                        name='password'
                        type="password"
                        value={input?.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                    />
                </div>

                <div className="input-group">
                    <label>Age</label>
                    <input
                        name='age'
                        type="number"
                        value={input?.age}
                        onChange={handleChange}
                        placeholder="00"
                    />
                </div>

                <div className='input-group'> 
                    <label htmlFor="gender" >Gender:</label>
                    <select id="gender" name="gender" value={input?.gender} onChange={handleChange}>
                        <option defaultValue="" disabled selected>Select gender</option>
                        <option value="male" className='input-group'>Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>


                <button type="submit" className="submit-btn">
                    {false ? ("update") : ("Get Started")}
                </button>
                {!false ? (
                    <div>
                        <span style={{ color: "#ffffff" }}>do you have account ? </span>

                        <Link to={'/login'} className='anchor-link'>login</Link>
                    </div>
                ) : (<></>)
                }
            </form>
        </div>
    )
}

export default SignUp