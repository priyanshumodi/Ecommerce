import { useState, useMemo } from "react";


const BuyPopup = ({ product, onClose, onConfirm }) => {
    const [quantity, setQuantity] = useState(1);
    const { _id, image, name, price } = product;
    
    const total = useMemo(() => {
        return price * quantity;
    }, [price, quantity]);

    const handleConfirm = () => {
        onConfirm({ productId: _id, quantity, price: total });
        onClose();
    };

    // Close modal when clicking the dark overlay behind the card
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-card">

                {/* Close button */}
                <button className="modal-close-btn" onClick={onClose}>✕</button>

                {/* Header: image + name */}
                <div className="modal-header">
                    <div className="modal-product-image">
                        <img src={image} alt={name} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{name}</h3>
                        <p style={{ margin: "4px 0 0", color: "#9B87F5", fontWeight: 700, fontSize: "1rem" }}>
                            ${price} / unit
                        </p>
                    </div>
                </div>

                {/* Form body */}
                <div className="modal-form">

                    {/* Quantity selector */}
                    <div className="form-group">
                        <label className="form-label">Quantity</label>
                        <div className="quantity-selector-modal">
                            <button
                                className="qty-btn"
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            >−</button>
                            <input
                                className="qty-input"
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val) && val >= 1) setQuantity(val);
                                }}
                            />
                            <button
                                className="qty-btn"
                                onClick={() => setQuantity(q => q + 1)}
                            >+</button>
                        </div>
                    </div>

                    {/* Live price */}
                    <div className="price-summary-row">
                        <span>{quantity} × ${price}</span>
                        <span className="final-price">${total}</span>
                    </div>

                    {/* Actions */}
                    <div className="modal-actions">
                        <button className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button className="btn-primary" onClick={handleConfirm}>Confirm Order</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BuyPopup