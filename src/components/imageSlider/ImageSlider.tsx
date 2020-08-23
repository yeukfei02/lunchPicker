import React, { useState, useEffect } from 'react';
import ImageGallery from 'react-image-gallery';
import _ from 'lodash';

function ImageSlider(props: any): JSX.Element {
  const [sliderList, setSliderList] = useState<any[]>([]);

  useEffect(() => {
    if (!_.isEmpty(props.photosList)) {
      const sliderList = props.photosList.map((item: any, i: number) => {
        const obj = {
          original: item,
          thumbnail: item,
        };
        return obj;
      });
      setSliderList(sliderList);
    }
  }, [props.photosList]);

  return (
    <div>
      <ImageGallery items={sliderList} />
    </div>
  );
}

export default ImageSlider;
