import React from 'react'
import Footer from '../Components/footer'
import Footerup from '../Components/footerup'
import Video from '../Components/video'
export default function About() {
    return (
        <div>
            <div className='header'>
                <h1>About Us</h1>
            </div>
            <div className="aboutdetail">
                <div className="aboutbox">
                    <div className='headingbox'>
                        <div className='headingleft'></div>
                        <h1>Our Mission</h1>
                    </div>
                    <div  className='aboutpara'>
                        <p>
                            Consectetur adipiscing elit, sued do eiusmod tempor ididunt udfgt labore et dolore magna aliqua. Quis ipsum suspendisces gravida. Risus commodo viverra sebfd dho eiusmod tempor maecenas accumsan lacus. Risus commodo viverra sebfd dho eiusmod tempor maecenas accumsan lacus.
                        </p>
                        <p>
                            Risus commodo viverra sebfd dho eiusmod tempor maecenas accumsan lacus. Risus commodo viverra sebfd dho eiusmod tempor maecenas accumsan.
                        </p>
                    </div>
                </div>
                <div className="aboutbox">
                    <div className='headingbox'>
                        <div className='headingleft'></div>
                        <h1>Our Vision</h1>
                    </div>
                    <div className='aboutpara'>
                        <p>
                            Consectetur adipiscing elit, sued do eiusmod tempor ididunt udfgt labore et dolore magna aliqua. Quis ipsum suspendisces gravida. Risus commodo viverra sebfd dho eiusmod tempor maecenas accumsan lacus. Risus commodo viverra sebfd dho eiusmod tempor maecenas accumsan lacus.
                        </p>
                        <p>
                            Risus commodo viverra sebfd dho eiusmod tempor maecenas accumsan lacus. Risus commodo viverra sebfd dho eiusmod tempor maecenas accumsan.
                        </p>
                    </div>
                </div>
            </div>
            <Video/>
            <Footerup/>
            <Footer/>
        </div>
    )
}
