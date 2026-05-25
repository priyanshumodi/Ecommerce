import React, { useState } from 'react';
import api from './services/apiConfig';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { addOrder } from './features/orderSlice';

const CheckOut = () => {
  const location = useLocation();

  const {orderSummary, product} = location.state;
  console.log(location.state)

  const [isProcessing, setIsProcessing] = useState(false);

  // Math Calculations based on hardcoded values
  const itemTotal = product.price * orderSummary.quantity;
  const shippingFee = itemTotal > 500 ? 0 : 50;
  const finalAmount = itemTotal + shippingFee;
  const navigate = useNavigate()
  const currentUser = useSelector(state => state.user.currentUser)
  const dispatch = useDispatch()
  console.log(currentUser)

  const [amount, setAmount] = useState(finalAmount); // Default Rs 500

  // Dynamically inject Razorpay's overlay payment window script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      alert('Razorpay SDK failed to load. Check network connection.');
      return;
    }

    try {
      // 1. Post target payment volume request to your Node API server
      const orderResponse = await api.post('/payment/order', { amount });
      const { id: order_id, currency } = orderResponse.data.data;
      console.log(orderResponse)
      console.log(import.meta.env.VITE_RAZORPAY_KEY_ID);


      // 2. Map standard setup configurations for checkout interaction
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Replace with your actual frontend Key ID
        amount: finalAmount,
        currency: currency,
        name: "ShopFusion pvt. lt.",
        description: "Secure Checkout Transaction",
        order_id: order_id,
        handler: async function (response) {
          // This block triggers automatically when payment window completes entries successfully
          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount,
            };

            // 3. Dispatch the payload parameters back to Node layer for verification
            const verifyResponse = await api.post('/payment/verify', verifyPayload);
            // console.log(verifyResponse)

            if (verifyResponse.data.success) {
              dispatch(addOrder({ productId: product?._id, addressId: "6a101d51e7d54ab69bac4564", quantity: orderSummary?.quantity }));
              navigate('/profile/orders')
              
            }

            // Navigate()
          } catch (error) {
            alert(`Payment validation failed matching signatures. ${error.message}`);

          }
        },
        prefill: {
          name: currentUser?.firstName+" "+currentUser?.lastName,
          email: currentUser?.email,
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Checkout operation processing fault:", error);
    }
  };

  return (
    <div className="checkout-overlay">
      <div className="checkout-container card-focused" style={{ maxWidth: '450px' }}>

        <div className="step-header-row">
          <h3>🛒 Order Summary</h3>
          <button className="close-x-btn" onClick={() => {}}>✕</button>
        </div>

        {/* Product Detail Layout Card */}
        <div className="summary-product-item">
          <div className="summary-img-box">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="summary-item-details">
            <h4 style={{ fontSize: '0.95rem', lineHeight: '1.3', margin: '0 0 4px 0' }}>
              {product.name}
            </h4>
            <p className="summary-item-meta" style={{ margin: '2px 0' }}>
              Quantity: <strong>{orderSummary.quantity}</strong>
            </p>
            <p className="summary-item-price">₹{product.price.toFixed(2)} each</p>
          </div>
        </div>

        {/* Pricing Ledger Breakdown */}
        <div className="pricing-ledger" style={{ marginTop: '20px' }}>
          <div className="ledger-row">
            <span>Subtotal Price Cost</span>
            <span>₹{itemTotal.toFixed(2)}</span>
          </div>
          <div className="ledger-row">
            <span>Shipping & Handling</span>
            <span className={shippingFee === 0 ? "free-text" : ""}>
              {shippingFee === 0 ? "FREE" : `₹${shippingFee.toFixed(2)}`}
            </span>
          </div>
          <div className="ledger-divider"></div>
          <div className="ledger-row total-row">
            <span>Total Amount Payable:</span>
            <span>₹{finalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Razorpay Gateway Activation Trigger Button */}
        <button
          className="pay-now-action-btn"
          onClick={handlePayment}
          disabled={isProcessing}
          style={{ marginTop: '10px' }}
        >
          {isProcessing ? (
            <div className="spinner"></div>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Proceed to Pay ₹{finalAmount.toFixed(2)}
            </>
          )}
        </button>

      </div>
    </div>
  );


};

export default CheckOut;