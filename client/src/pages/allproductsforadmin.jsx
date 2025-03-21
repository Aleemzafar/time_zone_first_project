import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Components/footer';
import Sidebar from '../Components/sidebar';
import { useCart } from '../Components/cartcontext';

export default function AllProductsForAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    axios
      .get('https://time-zone-first-project-api.vercel.app/allitems')
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load data items');
        setLoading(false);
        console.error(err);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`https://time-zone-first-project-api.vercel.app/deleteproduct/${id}`)
      .then(() => {
        // Remove the deleted item from the state
        setItems(items.filter((item) => item._id !== id));
      })
      .catch((err) => {
        console.error('Error deleting item:', err);
      });
  };

  if (loading) {
    return (
      <div>
        <Sidebar />
        <div className="allproductforadmin">
          <div className="loader">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Sidebar />
        <div className="allproductforadmin">
          <div className="error">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <Sidebar />
        <div className="allproductforadmin">
          <div className="error">No items found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Sidebar />
      <div className="allproductforadmin">
        <div className="popularproduct">
          {items.map((item) => {
            // Define handleAddToCart inside the map function to access the item
            const handleAddToCart = () => {
              addToCart({ ...item, quantity: 1 }); // Default quantity to 1
            };

            return (
              <div className="popularone" key={item._id}>
                <div className="image-container">
                  {item.image ? (
                    <img src={item.image} alt={item.itemname} />
                  ) : (
                    <div className="defaultprofile">
                      <img
                        title={item.itemname}
                        src={item?.images?.image1}
                        alt={item.itemname}
                      />
                    </div>
                  )}
                  <button className="add-to-cart" onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                </div>
                <Link to={`/updateitem/${item._id}`}>
                  <button className="btn btn-success">Edit</button>
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
                <Link to={`/productdetail/${item._id}`} className="linkwatch">
                  <h1>{item.itemname}</h1>
                </Link>
                <p>$ {item.itemprice}</p>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}