import React, { useState } from 'react';
import { useCart } from '../Components/cartcontext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from '../Components/footer';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare order details
    const orderDetails = {
      email,
      contactNumber,
      items: cart.map(item => ({
        itemId: item._id,
        itemname: item.itemname,
        itemprice: item.itemprice,
        quantity: item.quantity,
        images: item.images,
      })),
      total: cart.reduce((total, item) => total + item.itemprice * item.quantity, 0).toFixed(2),
    };

    ('Order Details:', orderDetails); // Debugging

    try {
      const response = await axios.post(`https://time-zone-first-project-api.vercel.app/orders`, orderDetails);
      alert('Order placed successfully!');
      (response.data);
      clearCart(); // Clear the cart after successful order placement
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div>
      <div className="checkout-container">
        <h1>Checkout</h1>
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Contact Number:</label>
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.images?.image1} alt={item.itemname} />
                <div className="item-details">
                  <h3>{item.itemname}</h3>
                  <p>Price: ${item.itemprice}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Total: ${(item.itemprice * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
            <div className="total">
              <h3>Total: ${cart.reduce((total, item) => total + item.itemprice * item.quantity, 0).toFixed(2)}</h3>
            </div>
          </div>
          <button type="submit" className="place-order-btn">Place Order</button>
        </form>
        <Link to="/cart" className="back-to-cart-link">
          <button className="back-to-cart-btn">Back to Cart</button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}