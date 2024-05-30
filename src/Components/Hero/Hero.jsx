import React from "react";
import "./Hero.scss";
import hand_icon from "../Assets/hand_icon.png";
import arrow_icon from "../Assets/arrow.png";
import hero_image from "../Assets/hero_image.png";

const Hero = () => {
    return (
        <div className="hero">
            <div className="col-12 col-lg-6">
                <div className="h-100 d-flex flex-column justify-content-center align-items-center flex-fill">
                    <div className="py-auto" style={{ fontWeight: "bold", fontSize: "80px" }}>
                        <h2>NEW ARRIVALS ONLY</h2>
                        <div className="font-weight-bold mb-4">
                            <div className="d-flex">
                                <p>New</p>
                                <img src={hand_icon} style={{ width: "80px", height: "80px" }} alt="" />
                            </div>
                            <p>collections</p>
                            <p>for everyone</p>
                        </div>
                        <div className="text-white rounded-pill" style={{ width: "310px", height: "70px", backgroundColor: "#ff4141", fontSize: "20px", fontWeight: "500", cursor: "pointer" }}>
                            <div className="d-flex justify-content-center align-items-center h-100">
                                <span className="me-2">Lastest Collection</span>
                                <img src={arrow_icon} style={{ width: "24px", height: "15px", marginTop: "5px" }} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="h-100 d-flex flex-fill justify-content-center align-items-center">
                    <div>
                        <img src={hero_image} style={{ width: "140%", height: "auto" }} alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
