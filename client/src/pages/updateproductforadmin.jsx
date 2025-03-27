import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import Footer from '../Components/footer';
import Sidebar from '../Components/sidebar';
import Footerup from '../Components/footerup';
 
export default function Updateproduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [detail, setDetail] = useState("");
    const [err, setErr] = useState("");
    const [category, setCategory] = useState("newarrival");
    const navigate = useNavigate();
    const [wordCount, setWordCount] = useState(0);
    const { id } = useParams();

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/getUser/${id}`)
            .then((result) => {
                setName(result.data.itemname);
                setPrice(result.data.itemprice);
                setDetail(result.data.detail);
                setCategory(result.data.category);
                setImage1(result.data.images.image1);
                setImage2(result.data.images.image2);
                setImage3(result.data.images.image3);
            })
            .catch((err) => {
                console.error('Error fetching items:', err.response?.data || err);
            });
    }, [id]);


    const handleInputChange = (e) => {
        const text = e.target.value;
        setDetail(text);
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        setWordCount(words);
    };

    const handleImage1 = (e) => {
        setImage1(e.target.files[0]);
    };

    const handleImage2 = (e) => {
        setImage2(e.target.files[0]);
    };

    const handleImage3 = (e) => {
        setImage3(e.target.files[0]);
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("itemname", name);
        formData.append("itemprice", price);
        formData.append("category", category);
        formData.append("detail", detail);
        if (image1) formData.append("image1", image1);
        if (image2) formData.append("image2", image2);
        if (image3) formData.append("image3", image3);

        axios
            .put(`${import.meta.env.VITE_API_BASE_URL}/updateproduct/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                navigate("/shop");
            })
            .catch((err) => {
                (err);
                setErr("Error updating product");
            });
    };

    return (
        <div>
            <Sidebar />
            <div className="header">
                <h1>Update New Item</h1>
            </div>
            <div className='adminformmain'>
                <div className="adminform">
                    <form onSubmit={handleAddItem}>
                        <div>
                            <label htmlFor="productname">Enter Name of item:</label>
                            <input
                                type="text"
                                id="productname"
                                name="productname"
                                placeholder="Enter Item name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="price">Enter Price of item:</label>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                placeholder="Enter Item price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div className='discriptiondiv'>
                            <label htmlFor="discription">Enter Description of item:</label>
                            <textarea
                                type="text"
                                id="discription"
                                name="discription"
                                placeholder="Enter Item Description"
                                value={detail}
                                onChange={handleInputChange}
                            />
                            <div style={{ fontSize: '0.8em', color: 'gray', marginTop: '5px' }}>
                                Word count: {wordCount}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="image1">Upload Image 1:</label>
                            <input
                                type="file"
                                id="image1"
                                name="image1"
                                accept="image/*"
                                onChange={handleImage1}
                            />
                        </div>
                        <div>
                            <label htmlFor="image2">Upload Image 2:</label>
                            <input
                                type="file"
                                id="image2"
                                name="image2"
                                accept="image/*"
                                onChange={handleImage2}
                            />
                        </div>
                        <div>
                            <label htmlFor="image3">Upload Image 3:</label>
                            <input
                                type="file"
                                id="image3"
                                name="image3"
                                accept="image/*"
                                onChange={handleImage3}
                            />
                        </div>
                        <div>
                            <label htmlFor="category">Select Category:</label>
                            <select
                                name="category"
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="newarrival">New Arrival</option>
                                <option value="lowprice">Low Price</option>
                                <option value="mostpopular">Most Popular</option>
                            </select>
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
            <Footerup />
            <Footer />
        </div>
    );
}