import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const isAuthenticated = useSelector(state => state.user.isAuthenticated)
  const navigate = useNavigate()
  const currentUser = useSelector(state => state.user.currentUser)
  console.log(currentUser)

  useEffect(() => {
    if(!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated])
  return (
    <div className="home-title">Welcome {currentUser?.firstName}</div>
  )
}

export default Home