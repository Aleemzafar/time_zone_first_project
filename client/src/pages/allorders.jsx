import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../Components/footer';
import Sidebar from '../Components/sidebar';

export default function AllOrders() {
    const [orders, setOrders] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        axios
            .get(`http://localhost:4001/allorders`)
            .then((response) => {
                console.log("Backend response:", response.data); // Log the response for debugging

                // Ensure the response data is an array
                if (Array.isArray(response.data)) {
                    setOrders(response.data);
                } else {
                    console.error("Expected an array but got:", response.data);
                    setOrders([]); // Set orders to an empty array if the response is not an array
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching orders:", err);
                setError("Failed to fetch orders. Please try again later.");
                setLoading(false);
            });
    };

    const handleShipped = (id) => {
        axios
            .delete(`http://localhost:4001/deleteorder/${id}`)
            .then(() => {
                setOrders(orders.filter(order => order._id !== id)); // Remove the shipped order from the list
                alert("Order shipped successfully");
            })
            .catch((err) => {
                console.error("Error deleting order:", err);
                setError("Failed to delete order. Please try again later.");
            });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <Sidebar />
            <div className="allusersforadmin">
                <table className="table table-hover table-bordered border-success w-100">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Item Name</th>
                            <th>Email</th>
                            <th>Quantity</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            // Ensure order.items is an array before calling .map()
                            const items = Array.isArray(order.items) ? order.items : [];

                            return items.map((item, index) => {
                                const images = item.images || {};
                                const itemName = item.itemname || 'N/A';
                                const quantity = item.quantity || 'N/A';
                                const itemPrice = item.itemprice || 'N/A';
                                const total = order.total || 'N/A';
                                const orderId = order._id;
                                const email = order.email || 'N/A';
                                const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';

                                return (
                                    <tr key={`${order._id}-${index}`}>
                                        <td>
                                            <img
                                                src={images.image1 || '/images/watch1.jpeg'} // Fallback image if image1 is missing
                                                alt={itemName || "wrist watch"}
                                                title={itemName || "WRIST WATCH"}
                                                style={{ width: '50px', height: '50px' }}
                                            />
                                        </td>
                                        <td>{itemName}</td>
                                        <td>{email}</td>
                                        <td>{quantity}</td>
                                        <td>{date}</td>
                                        <td>${itemPrice}</td>
                                        <td>${total}</td>
                                        <td>
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleShipped(orderId)}
                                            >
                                                Shipped
                                            </button>
                                        </td>
                                    </tr>
                                );
                            });
                        })}
                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    );
}