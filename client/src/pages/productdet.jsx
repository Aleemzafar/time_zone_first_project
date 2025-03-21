import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../Components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaPlus, FaMinus } from 'react-icons/fa';
import axios from 'axios';
import { useCart } from '../Components/cartcontext';

export default function ProductDetail() {
    const [item, setItem] = useState(null);
    const [err, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);

    const { id } = useParams();
    const { addToCart } = useCart();

    useEffect(() => {
        fetchItem();
    }, [id]);

    const fetchItem = () => {
        axios.get(`https://time-zone-first-project-api.vercel.app/itemdetail/${id}`)
            .then((response) => {
                if (response.data) {
                    setItem(response.data);
                    setTotalPrice(response.data.itemprice); // Initialize total price with item price
                    setLoading(false);
                }
            })
            .catch((err) => {
                setError('Item not fetched. Something went wrong with fetching.');
                setLoading(false);
            });
    };

    const handleIncrement = () => {
        setQuantity((prev) => prev + 1);
        setTotalPrice((prevTotal) => prevTotal + item.itemprice); // Update total price
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
            setTotalPrice((prevTotal) => prevTotal - item.itemprice); // Update total price
        }
    };

    const handleAddToCart = () => {
        if (item) {
            // Include the quantity in the item object
            addToCart({ ...item, quantity });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (err) {
        return <div>{err}</div>;
    }

    if (!item) {
        return <div>No item found.</div>;
    }

    // Extract images from the item object
    const { image1, image2, image3 } = item?.images || {}; // Safely destructure with optional chaining

    return (
        <div>
            <div className="header">
                <h1>Watch Shop</h1>
            </div>
            <div className="productdetial">
                <div className="productimgslides">
                    <div id="carouselExample" style={{ maxWidth: '500px', margin: '0 auto' }} className="carousel slide" data-bs-ride="carousel">
                        <div className="container">
                            <div id="myCarousel" className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-indicators">
                                    <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active" aria-current="true" style={{ backgroundColor: 'gray', borderRadius: '20px', border: '1px', color: 'white' }} aria-label="Slide 1"></button>
                                    <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" style={{ backgroundColor: 'gray', borderRadius: '20px', border: '1px', color: 'white' }} aria-label="Slide 2"></button>
                                    <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" style={{ backgroundColor: 'gray', borderRadius: '20px', border: '1px', color: 'white' }} aria-label="Slide 3"></button>
                                </div>
                                <div className="carousel-inner" style={{ height: '500px', width: '500px' }}>
                                    {/* Slide 1 */}
                                    <div className="carousel-item active" style={{ width: '500px', height: '500px' }}>
                                        <img src={image1} alt={item.itemname} className="d-block w-100" style={{ objectFit: 'cover', objectPosition: 'center', height: '100%', width: '100%' }} />
                                    </div>
                                    {/* Slide 2 */}
                                    <div className="carousel-item" style={{ width: '500px', height: '500px' }}>
                                        <img src={image2} alt={item.itemname} className="d-block w-100" style={{ objectFit: 'cover', objectPosition: 'center', height: '100%', width: '100%' }} />
                                    </div>
                                    {/* Slide 3 */}
                                    <div className="carousel-item" style={{ width: '500px', height: '500px' }}>
                                        <img src={image3} alt={item.itemname} className="d-block w-100" style={{ objectFit: 'cover', objectPosition: 'center', height: '100%', width: '100%' }} />
                                    </div>
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev" style={{ top: '50%', transform: 'translateY(-50%)', backgroundColor: 'gray', borderRadius: '50%', color: 'white', border: 'none', width: '40px', height: '40px' }}>
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next" style={{ top: '50%', transform: 'translateY(-50%)', backgroundColor: 'gray', borderRadius: '50%', color: 'white', border: 'none', width: '40px', height: '40px' }}>
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="productdetails">
                    <h1>{item.itemname}</h1>
                    <p>{item.detail}</p>
                </div>
                <div className="quantitycounter">
                    <p>Quantity</p>
                    <div className="productquantity">
                        <div className="quantitybox">
                            <button onClick={handleIncrement}><FaPlus style={{ color: '#828bb2' }} /></button>
                            <input type="text" value={quantity} readOnly />
                            <button onClick={handleDecrement}><FaMinus style={{ color: '#828bb2' }} /></button>
                        </div>
                    </div>
                    <p>Total: ${totalPrice.toFixed(2)}</p>
                </div>
                <Link to="/cart">
                    <button className="porductdetaibutton" onClick={handleAddToCart}>
                        ADD TO CART
                    </button>
                </Link>
            </div>
            <div className="permotionbox">
                <div className="permotionheading">
                    <h1>Get promotions & updates!</h1>
                    <p>Seamlessly empower fully researched growth strategies and interoperable internal or “organic” sources credibly innovate granular internal.</p>
                </div>
                <form className="permotionmail">
                    <input type="email" placeholder="Enter email" />
                    <button type="submit">Subscribe</button>
                </form>
            </div>
            <Footer />
        </div>
    );
}