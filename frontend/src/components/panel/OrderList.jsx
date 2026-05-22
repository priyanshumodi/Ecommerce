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
  console.log(orders)

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
  // return (
  //   <div className="form-wrapper">
  //     <div className="auth-form" style={{ maxWidth: '800px' }}> {/* Wider for data */}
  //       <h2>orders Records</h2>

  //       <div className="user-list-container"> {/* Reusing container for scrollability */}

  //         <div className="user-list-container"> {/* Reusing container for scrollability */}
  //           {orders.map((order) => (
  //             <div className="user-row" key={order?._id}>
  //               <div className="order-main-info">
  //                 <p className="user-name">Order #{order?._id}</p>
  //                 <p className="user-detail">{order?.customerDetail?.firstName}</p>
  //               </div>

  //               <div className="user-meta">
  //                 <span className="user-detail">Quantity</span>{order?.quantity}
  //               </div>

  //               <div className="order-meta-info">
  //                 <div className="user-meta">
  //                   <span>{new Date(order?.createdAt).toLocaleDateString()}</span>
  //                   <span className="product-price" style={{ fontSize: '16px' }}>
  //                     ${order?.totalPrice}
  //                   </span>
  //                 </div>
  //               </div>

  //               <div className="action-group">
  //                 {/* Status Badges */}
  //                 <span className={`priority-badge `}>
  //                   {order?.status}
  //                 </span>
  //                 {currentUser?.role === 'admin' ? (
  //                   <button
  //                     className="edit-btn">
  //                     Update
  //                   </button>
  //                 ) : (<></>)
  //                 }
  //                 <button
  //                   className="delete-btn"
  //                   onClick={() => handleDelete(order?._id)}
  //                 >
  //                   Delete
  //                 </button>
  //               </div>
  //             </div>
  //           ))}
  //         </div>

  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="form-wrapper">
      <div className="auth-form" style={{ maxWidth: '1000px' }}> {/* Slightly wider to accommodate address data beautifully */}
        <h2>Orders Records</h2>

        <div className="user-list-container"> {/* Main wrapper for scrollability */}
          {orders.map((order) => (
            <div className="user-row" key={order?._id}>

              {/* 1. Main Info */}
              <div className="order-main-info">
                <p className="user-name">Order #{order?._id}</p>
                <p className="user-detail">{order?.customerDetail?.firstName}</p>
              </div>

              {/* 2. Quantity */}
              <div className="user-meta">
                <span className="user-detail">Quantity</span>
                {order?.quantity}
              </div>

              {/* 3. NEW: Shipping Address Column */}
              <div className="order-meta-info" style={{ minWidth: '200px' }}>
                <div className="user-meta" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                  <span className="user-detail" style={{ fontWeight: 'bold', marginBottom: '2px' }}>Shipping Address</span>
                  <span className="user-detail">{order?.addressDetail?.address}</span>
                  <span className="user-detail">
                    {order?.addressDetail?.city}, {order?.addressDetail?.state} {order?.customerDetail?.pincode}
                  </span>
                  <span className="user-detail" style={{ opacity: 0.8, fontSize: '0.85em' }}>
                    {order?.addressDetail?.country}
                  </span>
                </div>
              </div>

              {/* 4. Date & Price */}
              <div className="order-meta-info">
                <div className="user-meta">
                  <span>{new Date(order?.createdAt).toLocaleDateString()}</span>
                  <span className="product-price" style={{ fontSize: '16px' }}>
                    ${order?.totalPrice}
                  </span>
                </div>
              </div>

              {/* 5. Actions & Status */}
              <div className="action-group">
                <span className={`priority-badge `}>
                  {order?.status}
                </span>
                {currentUser?.role === 'admin' && (
                  <button className="edit-btn">
                    Update
                  </button>
                )}
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
  );
}

export default OrderList