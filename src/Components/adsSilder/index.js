// AdsSlider.js

import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';

class AdsSlider extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true, // Enable auto-sliding
      autoplaySpeed: 2000, // Set the speed of auto-sliding in mi
    };

    const { adsDetails } = this.props;

    return (
      <Slider {...settings} className="carousel-container">
        {adsDetails && adsDetails.length > 0 ? (
          adsDetails.map((each, index) => (
            <div key={index} className="slide-item">
              <Link to="/">
                <img src={`data:image/jpeg;base64,${each.profilePhotoBlob}`} alt="Ad Image" className="ads-image"/>
              </Link>
            </div>
          ))
        ) : (
          <p>No ads found</p>
        )}
      </Slider>
    );
  }
}

export default AdsSlider;
