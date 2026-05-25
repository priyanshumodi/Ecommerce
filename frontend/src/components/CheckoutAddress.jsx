import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../src/components/features/userSlice'; // Adjust this import path if necessary
import './CheckoutAddress.css'; 

const CheckoutAddress = () => {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    // Form Input State matching your Mongoose Schema
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        pincode: '',
        state: '',
        country: 'India'
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await api.get('/address'); 
            setAddresses(response.data.addresses || response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error loading addresses:", error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/address/add', formData);
            if (response.data) {
                fetchAddresses();
                setShowForm(false);
                setFormData({ address: '', city: '', pincode: '', state: '', country: 'India' });
            }
        } catch (error) {
            console.error("Error adding address:", error);
            alert("Failed to save address. Please try again.");
        }
    };

    const handleSelectAddress = (addressId) => {
        // Redirects to payment page and carries the chosen address object identifier along
        navigate('/payment', { state: { selectedAddressId: addressId } });
    };

    if (loading) {
        return <div className="checkout-theme-loading">Loading your secure checkout configurations...</div>;
    }

    return (
        <div className="checkout-theme-wrapper">
            <h2 className="checkout-theme-title">Confirm Order</h2>
            <p className="checkout-theme-subtitle">Select an address below to proceed to secure payment, or configure a new route location.</p>

            <div className="checkout-theme-grid">
                
                {/* LEFT COLUMN: Your Addresses */}
                <div className="checkout-address-panel">
                    <h3 className="checkout-panel-heading">
                        <span>Saved Shipping Targets</span>
                        <span className="checkout-count-badge">{addresses.length}</span>
                    </h3>
                    
                    {addresses.length === 0 ? (
                        <div className="checkout-empty-state">
                            <p>No active delivery directions found on your profile metadata stack.</p>
                            {!showForm && (
                                <button type="button" onClick={() => setShowForm(true)} className="checkout-submit-btn">
                                    + Add Your First Address
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="checkout-cards-stack">
                            {addresses.map((item) => (
                                <div 
                                    key={item._id}
                                    onClick={() => handleSelectAddress(item._id)}
                                    className="checkout-address-row"
                                >
                                    <div className="checkout-custom-radio">
                                        <div className="checkout-radio-core" />
                                    </div>
                                    <div className="checkout-address-details">
                                        <p className="checkout-text-main">{item.address}</p>
                                        <p className="checkout-text-sub">
                                            {item.city}, {item.state} — <span className="checkout-pin-highlight">{item.pincode}</span>
                                        </p>
                                        <p className="checkout-text-meta">{item.country}</p>
                                    </div>
                                    <span className="checkout-action-hint">Deliver Here &rarr;</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Inline Interactive Form Trigger Panel */}
                <div className="checkout-form-panel">
                    {!showForm && addresses.length > 0 ? (
                        <button type="button" onClick={() => setShowForm(true)} className="checkout-btn-dashed">
                            + Add Another Delivery Address
                        </button>
                    ) : showForm && (
                        <div className="checkout-form-container">
                            <div className="checkout-form-header">
                                <h3>New Address Coordinates</h3>
                                <button type="button" onClick={() => setShowForm(false)} className="checkout-btn-cancel">Cancel</button>
                            </div>

                            <form onSubmit={handleAddAddress} className="checkout-inline-form">
                                <div className="checkout-input-group">
                                    <label>Street Address</label>
                                    <textarea 
                                        name="address" 
                                        required 
                                        value={formData.address} 
                                        onChange={handleInputChange}
                                        rows="2"
                                        placeholder="Flat/House No, Building, Area Line"
                                    />
                                </div>
                                <div className="checkout-form-row">
                                    <div className="checkout-input-group">
                                        <label>City</label>
                                        <input type="text" name="city" required value={formData.city} onChange={handleInputChange} placeholder="Mumbai" />
                                    </div>
                                    <div className="checkout-input-group">
                                        <label>Pincode</label>
                                        <input type="text" name="pincode" required value={formData.pincode} onChange={handleInputChange} placeholder="400001" />
                                    </div>
                                </div>
                                <div className="checkout-form-row">
                                    <div className="checkout-input-group">
                                        <label>State</label>
                                        <input type="text" name="state" required value={formData.state} onChange={handleInputChange} placeholder="Maharashtra" />
                                    </div>
                                    <div className="checkout-input-group">
                                        <label>Country</label>
                                        <input type="text" name="country" disabled value={formData.country} className="checkout-input-disabled" />
                                    </div>
                                </div>
                                <button type="submit" className="checkout-submit-btn w-100">
                                    Save and Deliver Here
                                </button>
                            </form>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CheckoutAddress;