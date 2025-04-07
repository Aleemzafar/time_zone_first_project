// Product.js
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "./cartcontext";

export default function Product() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { id } = useParams();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    axios
      .get(`http://localhost:4001/mostpopular`)
      .then((response) => {
        setItems(response.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
        console.error("Error fetching products:", err);
      });
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Loading...</p>
        {/* Add a spinner or loading animation here */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="popularitem">
      <div className="popularh12">
        <h1>Popular Items</h1>
        <p>Explore our latest collection of watches.</p>
      </div>

      <div className="popularproduct">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item._id} className="popularone">
              <Link to={`/productdetail/${item._id}`} className="linkwatch">
                <div className="image-container">
                  <img src={item.images?.image1} alt={item.itemname} />
                </div>
                <h1>{item.itemname}</h1>
                <p>$ {item.itemprice}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>

      <div className="viewmore">
        <Link to="/allproducts" className="viewmorelink">
          <button>View more Products</button>
        </Link>
      </div>
    </div>
  );
}