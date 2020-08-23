import React, { useState, useEffect } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import _ from 'lodash';

function CustomMapList(props: any): JSX.Element {
  const [markerList, setMarkerList] = useState<any[]>([]);

  useEffect(() => {
    setMarkerList([]);
    if (!_.isEmpty(props.nameList) && !_.isEmpty(props.locationStrList) && !_.isEmpty(props.coordinatesList)) {
      const marketList = _.merge(props.nameList, props.locationStrList, props.coordinatesList);
      setMarkerList(marketList);
    }
  }, [props.nameList, props.locationStrList, props.coordinatesList]);

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

  const renderMarker = () => {
    let renderMarkerList: any[] = [];

    if (!_.isEmpty(markerList)) {
      renderMarkerList = markerList.map((item: any, i: number) => {
        const position = [item.latitude || 0, item.longitude || 0] as LatLngTuple;
        return (
          <Marker key={i} position={position}>
            <Popup>
              <span>
                <b>{item.name}</b>
              </span>
              <br />
              <span
                onClick={e => handleAddressClick(e)}
                onMouseEnter={e => handleOnMouseEnterTextStyle(e)}
                onMouseLeave={e => handleOnMouseLeaveTextStyle(e)}
              >
                {item.locationStr}
              </span>
            </Popup>
          </Marker>
        );
      });
    }

    return renderMarkerList;
  };

  return (
    <Map center={position} zoom={13} style={{ width: '100%', height: '600px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {renderMarker()}
    </Map>
  );
}

export default CustomMapList;
