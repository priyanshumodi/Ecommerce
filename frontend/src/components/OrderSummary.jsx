import React, { useState } from 'react';
import api from './services/apiConfig';

const OrderSummary = ({ product, quantity, address, onBack, onClose, currentUser }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    // Math Calculations
    const itemTotal = product.price * quantity;
    const shippingFee = itemTotal > 500 ? 0 : 50; 
    const finalAmount = itemTotal + shippingFee;

    const handlePayNow = async () => {
        setIsProcessing(true);
        try {
            console.log("⚡ Initiating checkout tracking with server. Amount:", finalAmount);
            
            // 1. Fire secure payload sequence directly to your local Node server port 8000
            const response = await api.post("/payment/order", {
                amount: finalAmount
            });
            const orderData = response.data;

            // 2. Setup checkout variables mapping your Razorpay Dashboard Key ID
            const options = {
                key: "rzp_test_XXXXXXXXXXXXXX", // ⚠️ PASTE YOUR COPIED KEY ID STRING HERE
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Test Sandbox Checkout",
                description: `Purchase: ${quantity}x ${product.name}`,
                order_id: orderData.id, 
                handler: function (paymentResponse) {
                    console.log("Captured Payment Authorization ID String:", paymentResponse.razorpay_payment_id);
                    alert(`🎉 Mock Payment Confirmed Perfectly!\nPayment ID Token: ${paymentResponse.razorpay_payment_id}`);
                    onClose(); 
                },
                prefill: {
                    name: `${currentUser.firstName} ${currentUser.lastName}`,
                    email: currentUser.email,
                    contact: address.phone
                },
                theme: {
                    color: "#6a1b9a" // Deep purple color value matches your application background panels
                }
            };

            const paymentWindow = new window.Razorpay(options);
            paymentWindow.open();
        } catch (err) {
            console.error("Payment execution pipeline crashed:", err);
            alert("Backend server connection rejected or Razorpay Key ID configurations are wrong.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="step-wrapper view-fade-in">
            <div className="step-header-row">
                <button className="back-arrow-link" onClick={onBack}>← Edit Address</button>
                <h3>🛒 Order Summary</h3>
            </div>
            
            <div className="summary-product-item">
                <div className="summary-img-box">
                    <img src={product.image} alt={product.name} />
                </div>
                <div className="summary-item-details">
                    <h4 style={{ fontSize: '0.95rem', lineHeight: '1.3', margin: '0 0 4px 0' }}>{product.name}</h4>
                    <p className="summary-item-meta" style={{ margin: '2px 0' }}>Quantity: <strong>{quantity}</strong></p>
                    <p className="summary-item-price">₹{product.price.toFixed(2)} each</p>
                </div>
            </div>

            <div className="delivery-destination-preview">
                <h5>📍 Shipping Address Confirmation:</h5>
                <p>{address.street}, {address.city}, {address.state} - {address.zipCode}</p>
                <p>Phone: {address.phone}</p>
            </div>

            <div className="pricing-ledger">
                <div className="ledger-row">
                    <span>Subtotal Price Cost</span>
                    <span>₹{itemTotal.toFixed(2)}</span>
                </div>
                <div className="ledger-row">
                    <span>Shipping Charges</span>
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

            <button 
                className="pay-now-action-btn" 
                onClick={handlePayNow} 
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <div className="spinner"></div>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        Proceed to Pay ₹{finalAmount.toFixed(2)}
                    </>
                )}
            </button>
        </div>
    );
};

export default OrderSummary;