import React from 'react';
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa"; // Added FaTrash for remove button
import Footer from '../Components/footer';
import { Link } from 'react-router-dom';
import { useCart } from "../Components/cartcontext";

export default function Cart() {
  const { cart, incrementQuantity, decrementQuantity, removeFromCart } = useCart();

  // Display a message if the cart is empty
  if (cart.length === 0) {
    return (
      <div>
        <div className='header'>
          <h1>Cart</h1>
        </div>
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/">
            <button type='submit'>Continue Shopping</button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <div className='header'>
        <h1>Cart</h1>
      </div>
      <div className="cartmain">
        <div className="cart1">
          <div className="cartbox1"><p className='productcart'>Product</p></div>
          <div className="cartbox2">
            <p className='cartprice'>Price</p>
            <p className='cartquantity'>Quantity</p>
            <p className='carttotal'>Total</p>
          </div>
        </div>
        <div className="cartgrid">
          {cart.map((item) => (
            <div className="cart2" key={item._id}>
              <div className="cartleft2">
                <div className="cartproductimg">
                  <img src={item.images?.image1} alt={item.itemname} />
                </div>
                <div className="cartproductdetail">
                  <h3>{item.itemname}</h3>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    style={{ color: "red", cursor: "pointer", background: "none", border: "none" }}
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
              <div className="cartright2">
                <div className="cartright2box1"><p>${item.itemprice}</p></div>
                <div className="cartright2box2">
                  <div className="itemcountercart">
                    <input type="text" value={item.quantity} readOnly />
                  </div>
                  <div className="incredecre">
                    <button
                      onClick={() => incrementQuantity(item._id)}
                      style={{ margin: "10px", color: "green", fontSize: "20px", cursor: "pointer" }}
                    >
                      <FaPlus />
                    </button>
                    <button
                      onClick={() => decrementQuantity(item._id)}
                      style={{ margin: "10px", color: "red", fontSize: "20px", position: "relative", bottom: "20px", cursor: "pointer" }}
                    >
                      <FaMinus />
                    </button>
                  </div>
                </div>
                <div className="cartright2box3"><p>${(item.itemprice * item.quantity).toFixed(2)}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="subtotalbox">
        <div className="subtotal">
          <p>Subtotal</p>
          <input
            type="text"
            readOnly
            placeholder={`$${cart.reduce((total, item) => total + item.itemprice * item.quantity, 0).toFixed(2)}`}
          />
        </div>
      </div>
      <div className="cartlastbottombutton">
        <Link to="/">
          <button type='submit'>Continue Shopping</button>
        </Link>
        <Link to="/checkout">
          <button type='submit'>Proceed To Checkout</button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}