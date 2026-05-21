import React, { useState } from 'react'

const AddProduct = () => {
    const [input, setInput] = useState({
        name: "Iphone 16",
        description: "5G Mobile Phone with Camera Control",
        price: 65000,
        image: "https://m.media-amazon.com/images/I/712SuRmHG4L._SX679_.jpg",
        quantity: 10,
        category: "Electronics"
    })
    const handleSubmit = (e) => {
        e.preventDefault()

    }

    const handleChange = (e) => {
        const { name, description, price, image, quantity, category } = e.target
        console.log(name, description, price, image, quantity, category)
        setInput({
            ...input,
            [name]: value
        })
    }
    return (
        <div className="form-wrapper">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Login</h2>

                <div className="input-group">
                    <label>Email Address</label>
                    <input
                        name='email'
                        type="email"
                        value={input.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                    />
                </div>

                <div className="input-group">
                    <label>description</label>
                    <input
                        name='description'
                        type="text"
                        value={input.description}
                        onChange={handleChange}
                        placeholder="name@company.com"
                    />
                </div>




                <button type="submit" className="submit-btn">
                    Get Started
                </button>
            </form>
        </div>
    )
}

export default AddProduct