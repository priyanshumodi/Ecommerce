import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../features/userSlice';

const UserList = () => {
  const users = useSelector(state => state.user.users)
  const isAuthenticated = useSelector(state => state.user.isAuthenticated)
  const {isLoading, error} = useSelector(state => state.user)
  const dispatch = useDispatch()


  const apiCall = () => {
    dispatch(fetchAllUsers())
  }
console.log('user list')
  useEffect(() => {
    apiCall()
  }, [])

  if (isLoading) return <div className="home-title">Loading Data....</div>;
  if (error) return <div className="home-title" style={{ color: "#ff6b6b" }}>Error: {error}</div>;
  return (
    <div className="form-wrapper">
      <div className="auth-form" style={{ maxWidth: '800px' }}> {/* Wider for data */}
        <h2>Users Records</h2>

        <div className="user-list-container">
          {users?.map((user) => (
            <div key={user._id} className="user-row">
              <div className="user-info">
                <p className="user-name">{user.firstName} {user.lastName}</p>
                <p className="user-detail">{user.email}</p>
                <div className="user-meta">
                  <span>{user.createdAt}</span>
                  <span className={`priority-badge ${user.priority?.toLowerCase()}`}>
                    {user.gender}
                  </span>
                </div>
              </div>

              {/* <div className="action-group">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(user.id)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => dispatch(deleteRecord(user.id))}
                >
                  Delete
                </button>
              </div> */}
            </div>

          ))}
        </div>
      </div>
    </div>
  );
}

export default UserList