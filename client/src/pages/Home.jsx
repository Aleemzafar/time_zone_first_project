import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Video from '../Components/video';
import Footerup from '../Components/footerup';
import Product from '../Components/product';
import Footer from '../Components/footer';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NewArrival() {
  const navigate = useNavigate();
  const isLoggedIn = window.localStorage.getItem("isLogedIn");
  const role = window.localStorage.getItem("role");

  // If the user is logged in and an admin, redirect to Dashboard
  if (isLoggedIn && role === "admin") {
    navigate('/dashboard');
  }

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchnewarrivals();
  }, []);

  const fetchnewarrivals = () => {
    axios.get(`http://localhost:4001/newarrival`)
      .then((response) => {
        setItems(response.data);
      })
      .catch((err) => {
        ("Something went wrong with frontend newarrival", err);
      });
  };

  return (
    <div>
      <div className='home'>
        <div className='hleft'>
          <h1 className="slide-in">
            Select Your New Perfect Style
          </h1>
          <p className="slide-in">
            🌎 "Track Every Moment, Anywhere in the World."
            ⌚ Precision Timekeeping Across Time Zones – Stay Connected, Stay Ahead.
          </p>
          <Link to="/shop">
            <button className="slide-in">SHOP NOW</button>
          </Link>
        </div>

        <div className='hright'>
          <img
            src="https://preview.colorlib.com/theme/timezone/assets/img/hero/watch.png"
            alt="Watch Image"
            className="heartbeat-image"
          />
        </div>
      </div>

      <div className='newarrival'>
        <div className='namearrival'>
          <h1>New Arrivals</h1>
        </div>
        <div className='arrivalproducts'>
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item._id} className="arrivalone">
                <Link className="linkarrival" to={`/productdetail/${item._id}`} >
                  <div className="image-container">
                    <img
                      src={item.images?.image1}
                      alt={item.itemname}
                      className="zoom-image"
                    />
                  </div>
                  <h2>{item.itemname}</h2>
                  <h3>$ {item.itemprice}</h3>
                </Link>
              </div>
            ))
          ) : (
            <p>No new arrival items found</p>
          )}
        </div>
      </div>

      <div className='newarrivalebottom'>
        <div className='posters'>
          <div className="imgbox1"><img src="/images/watch6.jpeg" alt="WatchPicture" className='zooms-image' /></div>
          <div className="imgbox2"><img src="/images/watch5.jpeg" alt="WatchPicture" className='zooms-image' /></div>
          <div className="imgbox3"><img src="/images/watch3.jpg" alt="WatchPicture" className='zooms-image' /></div>
          <div className="imgbox4"><img src="/images/watch4.jpg" alt="WatchPicture" className='zooms-image' /></div>
        </div>
      </div>

      <Product />
      <div className="vido">
        <Video />
      </div>
      <div className="watchforchoice">
        <div className="choice1">
          <div className="choicedetail">
            <h1>Watch of Choice</h1>
            <p>For Adventure & Travel: "Master Time Zones at a Glance – Your Passport to Precision."
              Engineered for globetrotters who never miss a beat.
            </p>
            <Link to="/allproducts"><button>SHOW WATCHES</button></Link>
          </div>
          <div className="choiceimage">
            <img src="https://preview.colorlib.com/theme/timezone/assets/img/gallery/choce_watch1.png" alt="" />
          </div>
        </div>
        <div className="choice1">
          <div className="choiceimage">
            <img src="https://preview.colorlib.com/theme/timezone/assets/img/gallery/choce_watch2.png" alt="" />
          </div>
          <div className="choicedetail">
            <h1>Watch of Choice</h1>
            <p>
              "One Watch, Every Time Zone – Travel Smarter, Stay on Schedule."
              The ultimate companion for jet-setters and business nomads.</p>
            <Link to="/allproducts"><button>SHOW WATCHES</button></Link>
          </div>
        </div>
      </div>
      <Footerup />
      <Footer />
    </div>
  );
}