import React, { useState, useEffect } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import _ from 'lodash';

function CustomMapList(props) {
  const [markerList, setMarkerList] = useState([]);

  useEffect(() => {
    setMarkerList([]);
    if (!_.isEmpty(props.nameList) && !_.isEmpty(props.locationStrList) && !_.isEmpty(props.coordinatesList)) {
      const marketList = _.merge(props.nameList, props.locationStrList, props.coordinatesList);
      setMarkerList(marketList);
    }
  }, [props.nameList, props.locationStrList, props.coordinatesList]);

  const position = [props.latitude || 0, props.longitude || 0];

  const handleAddressClick = (e) => {
    const text = e.target.innerHTML;
    window.open(`https://www.google.com/maps/search/?api=1&query=${text}`);
  }

  const handleOnMouseEnterTextStyle = (e) => {
    e.target.setAttribute('style', 'cursor: pointer; text-decoration: underline; color: #ed1f30');
  }

  const handleOnMouseLeaveTextStyle = (e) => {
    e.target.removeAttribute('style');
  }

  const renderMarker = () => {
    let renderMarkerList = [];

    if (!_.isEmpty(markerList)) {
      renderMarkerList = markerList.map((item, i) => {
        const position = [item.latitude || 0, item.longitude || 0];
        return (
          <Marker key={i} position={position}>
            <Popup>
              <span><b>{item.name}</b></span>
              <br />
              <span
                onClick={(e) => handleAddressClick(e)}
                onMouseEnter={(e) => handleOnMouseEnterTextStyle(e)}
                onMouseLeave={(e) => handleOnMouseLeaveTextStyle(e)}>
                {item.locationStr}
              </span>
            </Popup>
          </Marker>
        )
      });
    }

    return renderMarkerList;
  }

  return (
    <Map center={position} zoom={13} style={{ width: "100%", height: "600px" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      {renderMarker()}
    </Map>
  )
}

export default CustomMapList;
