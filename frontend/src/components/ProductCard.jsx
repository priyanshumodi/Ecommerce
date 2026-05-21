import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addOrder } from "./features/orderSlice";
import { deleteProduct } from "./features/productSlice";
import BuyPopup from "./BuyPopup";


const ProductCard = ({ _id, image, name, price, description }) => {
  const [showModal, setShowModal] = useState(false);

  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const currentUser    = useSelector(state => state.user.currentUser);
  const navigate       = useNavigate();
  const dispatch       = useDispatch();

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowModal(true);
  };

  const handleConfirmOrder = ({ productId, quantity }) => {
    const orderSummary = {productId, quantity, price}
    const product = {_id, image, name, price, description}
    navigate('/payment', {state: {orderSummary, product}})
  };

  return (
    <>
      <div className="product-card">
        <div className="product-image-container">
          <img src={image} alt={name} className="product-image" />
        </div>

        <div className="product-info">
          <div className="product-header">
            <div className="name-price-group">
              <h3 className="product-name">{name}</h3>
              <h4 style={{ color: "#d2c9c9", fontWeight: 400, margin: "4px 0" }}>{description}</h4>
              <p className="product-price">${price}</p>
            </div>
          </div>
        </div>

        {currentUser?.role === 'admin' ? (
          <div className="btn">
            <button onClick={() => {}} className="buy-btn">Update</button>
            <button
              onClick={() => dispatch(deleteProduct(_id))}
              style={{ backgroundColor: "#ff6b6b" }}
              className="buy-btn"
            >
              Delete
            </button>
          </div>
        ) : (
          <button onClick={handleBuyClick} className="buy-btn">Buy Now</button>
        )}
      </div>

      {/* Modal mounts outside the card but inside the fragment */}
      {showModal && (
        <BuyPopup
          product={{ _id, image, name, price }}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmOrder}
        />
      )}
    </>
  );
};

export default ProductCard;