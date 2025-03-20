import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "./cartcontext"; // Import useCart correctly

export default function ProductForShop() {
  const [activeLink, setActiveLink] = useState("new-arrivals");
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart(); // Use useCart hook correctly

  // Function to handle button click
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  // Fetch data when activeLink changes
  useEffect(() => {
    let url = "";
    if (activeLink === "new-arrivals") url = "http://localhost:4001/newarrival";
    else if (activeLink === "price-high-to-low") url = "http://localhost:4001/lowprice";
    else if (activeLink === "most-popular") url = "http://localhost:4001/mostpopular";

    axios
      .get(url)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [activeLink]);

  // Handle Add to Cart
  const handleAddToCart = (product) => {
    ("Adding to cart:", product); // Debugging
    addToCart({ ...product, quantity: 1 }); // Add the product to the cart
  };

  return (
    <div>
      <div className="popularitems">
        <div className="popularbutton">
          <button
            className={`popularlinkprice ${activeLink === "new-arrivals" ? "active" : ""}`}
            onClick={() => handleLinkClick("new-arrivals")}
          >
            New Arrivals
          </button>
          <button
            className={`popularlinkprice ${activeLink === "price-high-to-low" ? "active" : ""}`}
            onClick={() => handleLinkClick("price-high-to-low")}
          >
            Price High To Low
          </button>
          <button
            className={`popularlinkprice ${activeLink === "most-popular" ? "active" : ""}`}
            onClick={() => handleLinkClick("most-popular")}
          >
            Most Popular
          </button>
        </div>

        <div className="popularproduct">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div className="popularone" key={index}>
                <div className="image-container">
                  <img src={product.images?.image1} title={product.itemname} alt={product.itemname} />
                  <button
                    className="add-to-cart"
                    onClick={() => handleAddToCart(product)} // Pass the product to handleAddToCart
                  >
                    Add to Cart
                  </button>
                </div>
                <Link to={`/productdetail/${product._id}`} className="linkwatch">
                  <h1>{product.itemname}</h1>
                </Link>
                <p>${product.itemprice}</p>
              </div>
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>

        <div className="viewmore">
          <Link to="/allproducts" className="viewmorelink">
            <button>View more Products</button>
          </Link>
        </div>
      </div>
    </div>
  );
}