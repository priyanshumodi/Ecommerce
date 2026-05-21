import React, { useEffect, useState } from 'react'
import './App.css'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from './features/userSlice'

const Login = () => {
    const [input, setInput] = useState({
        email: '',
        password: ''
    })
    const dispatch = useDispatch()
    const isAuthenticated = useSelector(state => state.user.isAuthenticated)
    const currentUser = useSelector(state => state.user.currentUser)

    const error = useSelector(state => state.user.error)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(loginUser(input))
        setInput({
            email: '',
            password: ''
        })
    }

    useEffect(() => {
        if(isAuthenticated && currentUser?.role === 'admin') {
            navigate('/admin')
        } else if(isAuthenticated) {
            navigate('/home')
        }
        console.log(isAuthenticated)
    }, [isAuthenticated])

    const handleChange = (e) => {
        const {name, value} = e.target 
        // console.log(name, value)
        setInput({
            ...input,
            [name]:value
        })
    }

    return (
        <div className="form-wrapper">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Login</h2>

                <div className="input-group">
                    <label>Email Address</label>
                    <input 
                    name='email' 
                    type="email" 
                    value={input.email}
                    onChange={handleChange}
                    placeholder="name@company.com" 
                    />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input 
                    name='password' 
                    type="password" 
                    value={input.password}
                    onChange={handleChange}
                    placeholder="••••••••" 
                    />
                </div>

                {error && <span className="error-message">⚠ {error}</span>}

                <button type="submit" className="submit-btn">
                    Get Started
                </button>
                <div>
                    <span style={{color: "#ffffff"}}>Don't have an account ? </span>
                    
                    <Link to={'/signup'} className='anchor-link'>signup</Link>
                </div>
            </form>
        </div>
    )
}

export default Login