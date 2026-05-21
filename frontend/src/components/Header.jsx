import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { logoutUser } from "./features/userSlice"

const Header = () => {
    const isAuthenticated = useSelector(state => state.user.isAuthenticated)
    const currentUser = useSelector(state => state.user.currentUser)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logoutUser())
        navigate('/login')
    }

    return (
        <>
            <header>
                <Link to={'/'} className="title">
                    Shop<span style={{ "color": "#9B87F5" }}>Fusion</span>
                </Link>
                {isAuthenticated && currentUser?.role !== 'admin' ? (
                    <nav className="navigation-bar">
                        <Link to={'/home'} className="navigations">
                            Home
                        </Link>
                        <Link to={'/profile'} className="navigations">
                            Profile
                        </Link>
                    </nav>
                ) : (<></>)
                }
                {isAuthenticated ? (
                    <div onClick={handleLogout} className="login-btn">
                        Logout
                    </div>
                ) : (
                    <Link to={'/login'} className="login-btn">
                        Login
                    </Link>
                )
                }
            </header>
        </>
    )
}

export default Header