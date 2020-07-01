import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';

function CustomMap(props: any) {
  const position = [props.latitude || 0, props.longitude || 0] as LatLngTuple;

  const handleAddressClick = (e: any) => {
    const text = e.target.innerHTML;
    window.open(`https://www.google.com/maps/search/?api=1&query=${text}`);
  };

  const handleOnMouseEnterTextStyle = (e: any) => {
    e.target.setAttribute('style', 'cursor: pointer; text-decoration: underline; color: #ed1f30');
  };

  const handleOnMouseLeaveTextStyle = (e: any) => {
    e.target.removeAttribute('style');
  };

  return (
    <Map center={position} zoom={15} style={{ width: '100%', height: '400px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          <span>
            <b>{props.name}</b>
          </span>
          <br />
          <span
            onClick={e => handleAddressClick(e)}
            onMouseEnter={e => handleOnMouseEnterTextStyle(e)}
            onMouseLeave={e => handleOnMouseLeaveTextStyle(e)}
          >
            {props.address}
          </span>
        </Popup>
      </Marker>
    </Map>
  );
}

export default CustomMap;
