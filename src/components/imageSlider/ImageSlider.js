import React, { useState, useEffect } from 'react';
import _ from 'lodash';

function ImageSlider(props) {
  const [sliderList, setSliderList] = useState([]);

  useEffect(() => {
    if (!_.isEmpty(props.photosList)) {
      const sliderList = props.photosList.map((item, i) => {
        return (
          <div key={i}>
            <img src={item} alt="imageUrl" width="200" height="200" />
          </div>
        );
      });
      setSliderList(sliderList);
    }
  }, [props.photosList]);

  return (
    <div>

    </div>
  );
}

export default ImageSlider;
