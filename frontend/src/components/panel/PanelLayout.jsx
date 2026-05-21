import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";

const PanelLayout = () => {
    const currentUser = useSelector(state => state.user.currentUser)
    return (
        <div className="admin-layout">
            {/* Sidebar Nav */}
            <nav className="side-panel">
                <div className="admin-logo">
                    Shop<span style={{ color: '#9B87F5' }}>{currentUser?.role === 'admin' ? "Admin" : "User"}</span>
                </div>

                {currentUser?.role === 'admin' ? (
                    <div className="nav-links">
                        <NavLink to="/admin" className="nav-item" end>
                            <span style={{ marginRight: '12px' }}>👥</span> All Users
                        </NavLink>

                        <NavLink to="products" className="nav-item">
                            <span style={{ marginRight: '12px' }}>📦</span> All Products
                        </NavLink>

                        <NavLink to="orders" className="nav-item">
                            <span style={{ marginRight: '12px' }}>📊</span> All Orders
                        </NavLink>

                        <NavLink to="chat-room" className="nav-item">
                            <span style={{ marginRight: '12px' }}>
                                <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#9B87F5"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            </svg>
                            </span> Chats
                        </NavLink>
                    </div>
                ) : (

                    <div className="nav-links">
                        <NavLink to="" className="nav-item" end>
                            <span style={{ marginRight: '12px' }}>📦</span> All Products
                        </NavLink>

                        <NavLink to="orders" className="nav-item">
                            <span style={{ marginRight: '12px' }}>📊</span> My Orders
                        </NavLink>

                        <NavLink to="chat-room" className="nav-item">
                            <span style={{ marginRight: '12px' }}>
                                <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#9B87F5"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            </svg>
                            </span> Chats
                        </NavLink>
                    </div>
                )
                }
            </nav>

            {/* Main Admin or user page */}
            <main className='admin-main'>
                <Outlet />
            </main>
        </div>
    );
}

export default PanelLayout