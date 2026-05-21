import React, { useState } from 'react';

const ShippingForm = ({ initialAddress, onNext, onClose }) => {
    const [address, setAddress] = useState(initialAddress);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext(address); // Passes data to parent step state controller
    };

    return (
        <div className="step-wrapper view-fade-in">
            <div className="step-header-row">
                <h3>📋 Shipment Destination</h3>
                <button className="close-x-btn" onClick={onClose}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="address-form">
                <div className="form-input-group">
                    <label>Street Address *</label>
                    <input type="text" name="street" value={address.street} onChange={handleInputChange} required />
                </div>
                
                <div className="form-row-split">
                    <div className="form-input-group">
                        <label>City *</label>
                        <input type="text" name="city" value={address.city} onChange={handleInputChange} required />
                    </div>
                    <div className="form-input-group">
                        <label>State</label>
                        <input type="text" name="state" value={address.state} onChange={handleInputChange} />
                    </div>
                </div>
                
                <div className="form-row-split">
                    <div className="form-input-group">
                        <label>PIN / Zip Code *</label>
                        <input type="text" name="zipCode" value={address.zipCode} onChange={handleInputChange} required />
                    </div>
                    <div className="form-input-group">
                        <label>Contact Phone Number *</label>
                        <input type="tel" name="phone" value={address.phone} onChange={handleInputChange} required />
                    </div>
                </div>
                
                <button type="submit" className="continue-flow-btn">
                    Review Order Summary →
                </button>
            </form>
        </div>
    );
};

export default ShippingForm;