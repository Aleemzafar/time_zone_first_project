import React from 'react'
import Footer from '../Components/footer'
import { FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom'
export default function blog() {

    return (
        <div>
            <div className='header'>
                <h1>Blog</h1>
            </div>
            <div className="blogbox">
                <div className="blogleft">
                    <div className="blogimage">
                        <img style={{ width: "750px", height: "450px" }} src="https://preview.colorlib.com/theme/timezone/assets/img/blog/single_blog_1.png" alt="Blog" />
                        <Link style={{ textDecoration: "none" }}>
                            <div className="blogdate">
                                <h1>
                                    51
                                </h1>
                                <p>Jan</p>
                            </div>
                        </Link>
                        <div className="blogs">
                            <Link className='blogstopic' style={{ textDecoration: "none", color: "black", position: "relative", bottom: "80px" }}><h1>Google inks pact for new 35-storey office</h1></Link>
                            <p>That dominion stars lights dominion divide years for fourth have don't stars is that he earth it first without heaven in place seed it second morning saying.
                            </p>
                        </div>
                    </div>
                    <div className="blogimage">
                        <img style={{ width: "750px", height: "450px" }} src="https://preview.colorlib.com/theme/timezone/assets/img/blog/single_blog_2.png" alt="Blog" />
                        <Link style={{ textDecoration: "none" }}>
                            <div className="blogdate">
                                <h1>
                                    51
                                </h1>
                                <p>Jan</p>
                            </div>
                        </Link>
                        <div className="blogs">
                            <Link className='blogstopic' style={{ textDecoration: "none", color: "black", position: "relative", bottom: "80px" }}><h1>Google inks pact for new 35-storey office</h1></Link>
                            <p>That dominion stars lights dominion divide years for fourth have don't stars is that he earth it first without heaven in place seed it second morning saying.
                            </p>
                        </div>
                    </div>
                    <div className="blogimage">
                        <img style={{ width: "750px", height: "450px" }} src="	https://preview.colorlib.com/theme/timezone/assets/img/blog/single_blog_3.png" alt="Blog" />
                        <Link style={{ textDecoration: "none" }}>
                            <div className="blogdate">
                                <h1>
                                    51
                                </h1>
                                <p>Jan</p>
                            </div>
                        </Link>
                        <div className="blogs">
                            <Link className='blogstopic' style={{ textDecoration: "none", color: "black", position: "relative", bottom: "80px" }}><h1>Google inks pact for new 35-storey office</h1></Link>
                            <p>That dominion stars lights dominion divide years for fourth have don't stars is that he earth it first without heaven in place seed it second morning saying.
                            </p>
                        </div>
                    </div>
                    <div className="blogimage">
                        <img style={{ width: "750px", height: "450px" }} src="https://preview.colorlib.com/theme/timezone/assets/img/blog/single_blog_4.png" alt="Blog" />
                        <Link style={{ textDecoration: "none" }}>
                            <div className="blogdate">
                                <h1>
                                    51
                                </h1>
                                <p>Jan</p>
                            </div>
                        </Link>
                        <div className="blogs">
                            <Link className='blogstopic' style={{ textDecoration: "none", color: "black", position: "relative", bottom: "80px" }}><h1>Google inks pact for new 35-storey office</h1></Link>
                            <p>That dominion stars lights dominion divide years for fourth have don't stars is that he earth it first without heaven in place seed it second morning saying.
                            </p>
                        </div>
                    </div>
                    <div className="blogimage">
                        <img style={{ width: "750px", height: "450px" }} src="https://preview.colorlib.com/theme/timezone/assets/img/blog/single_blog_5.png
" alt="Blog" />
                        <Link style={{ textDecoration: "none" }}>
                            <div className="blogdate">
                                <h1>
                                    51
                                </h1>
                                <p>Jan</p>
                            </div>
                        </Link>
                        <div className="blogs">
                            <Link className='blogstopic' style={{ textDecoration: "none", color: "black", position: "relative", bottom: "80px" }}><h1>Google inks pact for new 35-storey office</h1></Link>
                            <p>That dominion stars lights dominion divide years for fourth have don't stars is that he earth it first without heaven in place seed it second morning saying.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="blogright">
                    <form action="">
                        <div className="blogright1">
                            <div className='bloginput'>
                                <input type="text" placeholder='Search Keywords' /><button type="submit" className='blogbutton1'><FaSearch size={24} /></button>
                            </div>
                            <div>
                                <Link to="/search">
                                    <button type="submit" className="blogbutton">
                                        <p style={{ letterSpacing: "5px" }}>SEARCH</p>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </form>
                    <div className="blogright2">
                        <div>
                            <h1>Category</h1>
                        </div>
                        <div className='blogcat'>
                            <Link className='blogcatlink'><p>Resaurant food(37)</p></Link>
                            <Link className='blogcatlink'><p>Travel news(10)</p></Link>
                            <Link className='blogcatlink'><p>Modern technology(03)</p></Link>
                            <Link className='blogcatlink'><p>Product(11)</p></Link>
                            <Link className='blogcatlink'><p>Inspiration(21)</p></Link>
                            <Link className='blogcatlink'><p>Health Care (21)09</p></Link>
                        </div>
                    </div>
                    <div className="blogright3">
                        <div>
                            <h1 style={{ paddingBottom: "20px", fontSize: "1.2rem" }}>Recent Post</h1>
                        </div>
                        <div className='blogpost'>
                            <div className='postimage'>
                                <img src="	https://preview.colorlib.com/theme/timezone/assets/img/post/post_1.png" alt="Recent Post" />
                            </div>
                            <div>
                                <Link className='postlink'><h1>From life was you fish...</h1></Link>
                                <p>January 12, 2019</p>
                            </div>
                        </div>
                        <div className='blogpost'>
                            <div className='postimage'>
                                <img src="	https://preview.colorlib.com/theme/timezone/assets/img/post/post_2.png" alt="Recent Post" />
                            </div>
                            <div>
                                <Link className='postlink'><h1>The Amazing Hubble</h1></Link>
                                <p>02 Hours ago</p>
                            </div>
                        </div>
                        <div className='blogpost'>
                            <div className='postimage'>
                                <img src="	https://preview.colorlib.com/theme/timezone/assets/img/post/post_3.png" alt="Recent Post" />
                            </div>
                            <div>
                                <Link className='postlink'><h1>Astronomy Or Astrology</h1></Link>
                                <p>03 Hours ago</p>
                            </div>
                        </div>
                        <div className='blogpost'>
                            <div className='postimage'>
                                <img src="https://preview.colorlib.com/theme/timezone/assets/img/post/post_4.png" alt="Recent Post" />
                            </div>
                            <div>
                                <Link className='postlink'><h1>Asteroids telescope</h1></Link>
                                <p>01 Hours ago</p>
                            </div>
                        </div>
                    </div>
                    <div className="blogright4">
                        <div>
                            <h1>Tag Clouds</h1>
                        </div>
                        <div className='blogtags'>
                            <div>
                                <Link className='blogtaglink'><p>project</p></Link>
                            </div>
                            <div>
                                <Link className='blogtaglink'><p>illustration</p></Link>
                            </div>
                            <div>
                                <Link className='blogtaglink'><p>love</p></Link>
                            </div>
                            <div>
                                <Link className='blogtaglink'><p>technology</p></Link>
                            </div>
                            <div>
                                <Link className='blogtaglink'><p>travel</p></Link>
                            </div>
                            <div>
                                <Link className='blogtaglink'><p>resturant</p></Link>
                            </div>
                            <div>
                                <Link className='blogtaglink'><p>life style</p></Link>
                            </div>
                            <div>
                                <Link className='blogtaglink'><p>design</p></Link>
                            </div>
                        </div>
                    </div>
                    <div className="blogright5">
                        <div>
                            <h1>Instagram Feeds</h1>
                        </div>
                        <div className='blogInstagram'>
                            <div className='instaimg'>
                                <img src="https://preview.colorlib.com/theme/timezone/assets/img/post/post_5.png" alt="Instagram feeds" />
                            </div>
                            <div className='instaimg'>
                                <Link>
                                    <img src="https://preview.colorlib.com/theme/timezone/assets/img/post/post_6.png" alt="Instagram feeds" /></Link>
                            </div>
                            <div className='instaimg'>
                                <Link><img src="	https://preview.colorlib.com/theme/timezone/assets/img/post/post_7.png" alt="Instagram feeds" /></Link>
                            </div>
                            <div className='instaimg'>
                                <Link> <img src="https://preview.colorlib.com/theme/timezone/assets/img/post/post_8.png" alt="Instagram feeds" /></Link>
                            </div>
                            <div className='instaimg'>
                                <Link> <img src="https://preview.colorlib.com/theme/timezone/assets/img/post/post_9.png" alt="Instagram feeds" /></Link>
                            </div>
                            <div className='instaimg'>
                                <Link> <img src="https://preview.colorlib.com/theme/timezone/assets/img/post/post_10.png" alt="Instagram feeds" /></Link>
                            </div>
                        </div>
                    </div>
                        <form action="">
                            <div className="blogright6">
                                    <div>
                                        <h1>Newsletter</h1>
                                    </div>
                                <div className='bloginputnew'>
                                    <input type="text" placeholder='Search Keywords' />
                                </div>
                                <div>
                                    <Link to="/search">
                                        <button type="submit" className="blogbutton">
                                            <p style={{ letterSpacing: "5px" }}>SEARCH</p>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </form>
                </div>
            </div>
            <div className="nextpagebutton">
                <Link className='linknextoage' ><FaChevronLeft size={24} /></Link>
                <div className="pageno">
                    <Link className='linknextoage'>1</Link>
                    <Link className='linknextoage'>2</Link>
                    <Link className='linknextoage'>3</Link>
                </div>
                <Link className='linknextoage'><FaChevronRight size={24} /></Link>
            </div>
            <Footer />
        </div>
    )
}
