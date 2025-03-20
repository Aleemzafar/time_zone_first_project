import React, { useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const VideoHome = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayClick = () => {
        setIsPlaying(true);
    };

    return (
        <div className="videohome">
            {!isPlaying && (
                <div className="thumbnail">
                    <div className="thumbnail-content">
                        <div className="playbutton">
                            <button
                                className="playarrow"
                                onClick={handlePlayClick}
                            >
                                <FaPlay style={{position:"relative",bottom:"13px",right:"7px"}}/>
                        </button>
                        </div>
                        <div className="nextbutton">
                            <Link className="nextvideo">
                                <button>
                                    <h2>NEXT VIDEO</h2>
                                    <img src="/images/right-arrow.png" alt="" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            {isPlaying && (
                <iframe
                    src="https://www.youtube.com/embed/YGQBm9Mnad8?autoplay=1"
                    style={{
                        width: "1345px",
                        height: "700px",
                        position: "relative",
                        zIndex: "1",
                    }}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            )}
        </div>
    );
};

export default VideoHome;
