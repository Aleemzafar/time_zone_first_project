import React from 'react'
import { FaTwitter, FaFacebook, FaBehance, FaGlobe } from "react-icons/fa";
import { Link } from 'react-router-dom'

export default function footer() {
    return (
        <div className='footermain'>
            <div className="footertop">
                <div className="footertopbox1">
                    <Link to={'/'}>
                        <img
                            src="https://preview.colorlib.com/theme/timezone/assets/img/logo/logo.png"
                            alt="Logo" />
                    </Link>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem numquam .</p>
                </div>
                <div className="footertopbox2">
                    <div>
                    <h1>Quick Links</h1>
                    </div>
                   <div className="linkbox" >
                   <Link className='linkfootertop'>About</Link>
                    <Link className='linkfootertop'>Offers & Discounts</Link>
                    <Link className='linkfootertop'>Get Coupon</Link>
                    <Link className='linkfootertop'>Contact Us</Link>
                   </div>
                </div>
                <div className="footertopbox2">
                    <div>
                    <h1>New Products</h1>
                    </div>
                    <div className="linkbox">
                    <Link className='linkfootertop'>Woman Cloth</Link>
                    <Link className='linkfootertop'>Fashion Accessories</Link>
                    <Link className='linkfootertop'>Man Accessories</Link>
                    <Link className='linkfootertop'>Rubber made Toys</Link>
                    </div>
                </div>
                <div className="footertopbox2">
                    <div>
                    <h1>Support</h1>
                    </div>
                    <div className="linkbox">
                    <Link className='linkfootertop'>Frequently Asked Questions</Link>
                    <Link className='linkfootertop'>Terms & Conditions</Link>
                    <Link className='linkfootertop'>Privacy Policy</Link>
                    <Link className='linkfootertop'>Report a Payment Issue</Link>
                    </div>
                </div>
            </div>
            <div className="footerbottom">
                <div className="footerbottombox1">
                    <p>Copyright ©2024 All rights reserved </p>
                </div>
                <div className="footerbottombox2">
                    <FaTwitter className='iconsflip' style={{ fontSize: "19px" }} />
                    <FaFacebook className='iconsflip' style={{ fontSize: "19px" }} />
                    <FaBehance className='iconsflip' style={{ fontSize: "19px" }} />
                    <FaGlobe className='iconsflip' style={{ fontSize: "19px" }} />
                </div>
            </div>
        </div>

    )
}
