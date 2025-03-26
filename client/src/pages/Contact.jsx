import React from 'react'
import Footer from '../Components/footer'
import { FaHome, FaEnvelope, FaPhone } from "react-icons/fa";
export default function Contact() {
    const containerStyle = {
        width: "100%",
        height: "400px",
    };

    const center = {
        lat: 37.7749,
        lng: -122.4194,
    };
    return (
        <div>
            <div className='header'>
                <h1>Contact</h1>
            </div>
            <div className="goolemap">
            </div>
            <div className='contactmain'>
                <form className="feedback">
                    <div className="textareacontact"><h1>Get in Touch</h1>
                        <textarea name="" id="" style={{ width: "730px", height: "200px" }}></textarea></div>
                    <div className='usernamecontact'>
                        <div className='contactname'>
                            <input type="text" name="" id="" placeholder='Enter your name' />
                            <label htmlFor="subject" >come on, you have a name, don't you?</label>
                        </div>
                        <div className='contactemail'>
                            <input type="email" name="" id="" placeholder='Enter email address' />
                        </div>
                    </div>
                    <div className="contactsubject">
                        <input type="text" name='subject' className='subject' placeholder='Enter subject' />
                        <label htmlFor="subject" >come on, you have a subject, don't you?</label>
                    </div>
                    <div className="contactsend">
                        <button type="submit">SEND</button>
                    </div>
                </form>
                <div className="customercare">
                    <div className="csbox1">
                        <div className="csicon">
                            <FaHome size={20} />
                        </div>
                        <div className="csdetail">
                            <h3>
                                Buttonwood, California.
                            </h3>
                            <p>
                                Rosemead, CA 91770
                            </p>
                        </div>


                    </div>

                    <div className="csbox2">
                        <div className="csicon">
                            <FaPhone size={20} />
                        </div>
                        <div className="csdetail">
                            <h3>
                                +1 253 565 2365
                            </h3>
                            <p>
                                Mon to Fri 9am to 6pm
                            </p>
                        </div>
                    </div>
                    <div className="csbox3">
                        <div className="csicon">
                            <FaEnvelope size={20} />
                        </div>
                        <div className="csdetail">
                            <h3>
                                support@colorlib.com
                            </h3>
                            <p>
                                Send us your query anytime!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
