import React, { useState } from 'react';
import ShipmentForm from './ShipmentForm';
import OrderSummary from './OrderSummary';
import './App.css';

const CheckoutScreen = ({ onClose = () => alert("Closed Checkout Test Overlay") }) => {
    // Step state tracking: 1 = Shipping, 2 = Summary
    const [step, setStep] = useState(1);

    // 1. HARDCODED USER & PRODUCT DATA FOR UI AND PRICING TESTING
    const hardcodedData = {
        product: {
            _id: "test_prod_999",
            name: "Premium Mechanical Wireless Keyboard v2",
            price: 2499.00, // Cost per item in INR
            image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=300&auto=format&fit=crop"
        },
        quantity: 2, // Hardcoded item count
        currentUser: {
            firstName: "Rohan",
            lastName: "Sharma",
            email: "rohan.test@example.com"
        }
    };

    // 2. HARDCODED INITIAL ADDRESS STATE (Pre-fills Step 1)
    const [savedAddress, setSavedAddress] = useState({
        street: '102, Green Valley Apartments, Sector 45',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        phone: '9876543210'
    });

    const handleAddressSubmit = (validatedAddress) => {
        setSavedAddress(validatedAddress);
        setStep(2); // Advance smoothly to Step 2
    };

    return (
        <div className="checkout-overlay">
            <div className="checkout-container card-focused">
                
                {/* Global Step Progress Breadcrumbs */}
                <div className="checkout-top-progress-indicator">
                    <span className={step === 1 ? "step active" : "step done"}>1. Shipping</span>
                    <span className="step-arrow">→</span>
                    <span className={step === 2 ? "step active" : "step"}>2. Summary</span>
                </div>

                {step === 1 ? (
                    <ShipmentForm 
                        initialAddress={savedAddress}
                        onNext={handleAddressSubmit} 
                        onClose={onClose} 
                    />
                ) : (
                    <OrderSummary 
                        product={hardcodedData.product}
                        quantity={hardcodedData.quantity}
                        address={savedAddress}
                        currentUser={hardcodedData.currentUser}
                        onBack={() => setStep(1)} // Returns backwards to change shipping safely
                        onClose={onClose}
                    />
                )}
                
            </div>
        </div>
    );
};

export default CheckoutScreen;