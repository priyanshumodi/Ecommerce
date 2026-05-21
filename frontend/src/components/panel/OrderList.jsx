import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchAllOrders, fetchMyOrders, deleteOrder } from "../features/orderSlice"
import '../App.css'

const OrderList = () => {
  const { isLoading, error } = useSelector(state => state.order)
  const currentUser = useSelector(state => state.user.currentUser)

  const allOrders = useSelector(state => state.order.orders);
  const myOrders = useSelector(state => state.order.myOrders);

  const orders = currentUser?.role === 'admin' ? allOrders : myOrders

  const dispatch = useDispatch()

  const handleDelete = (_id) => {
    dispatch(deleteOrder(_id))
  }


  useEffect(() => {
    if (currentUser?.role === 'admin') {
      dispatch(fetchAllOrders())
    } else if (currentUser?.role === 'user') {
      dispatch(fetchMyOrders())
    }
  }, [dispatch])

  if (isLoading) return <div className="home-title">Loading Data....</div>;
  if (error) return <div className="home-title" style={{ color: "#ff6b6b" }}>Error: {error}</div>;
  return (
    <div className="form-wrapper">
      <div className="auth-form" style={{ maxWidth: '800px' }}> {/* Wider for data */}
        <h2>orders Records</h2>

        <div className="user-list-container"> {/* Reusing container for scrollability */}

          <div className="user-list-container"> {/* Reusing container for scrollability */}
            {orders.map((order) => (
              <div className="user-row" key={order?._id}>
                <div className="order-main-info">
                  <p className="user-name">Order #{order?._id}</p>
                  <p className="user-detail">{order?.customerDetail?.firstName}</p>
                </div>

                <div className="user-meta">
                  <span className="user-detail">Quantity</span>{order?.quantity}
                </div>

                <div className="order-meta-info">
                  <div className="user-meta">
                    <span>{new Date(order?.createdAt).toLocaleDateString()}</span>
                    <span className="product-price" style={{ fontSize: '16px' }}>
                      ${order?.totalPrice}
                    </span>
                  </div>
                </div>

                <div className="action-group">
                  {/* Status Badges */}
                  <span className={`priority-badge `}>
                    {order?.status}
                  </span>
                  {currentUser?.role === 'admin' ? (
                    <button
                      className="edit-btn">
                      Update
                    </button>
                  ) : (<></>)
                  }
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(order?._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );

}

export default OrderList