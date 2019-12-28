import React from 'react';
import Map from 'pigeon-maps'
import Marker from 'pigeon-marker';

function CustomMap(props) {
  return (
    <div style={{ overflowX: 'hidden' }}>
      <Map
        center={[props.latitude || 0, props.longitude || 0]}
        zoom={13}
        width={700}
        height={450}>
        <Marker anchor={[props.latitude || 0, props.longitude || 0]} payload={1} onClick={({ event, anchor, payload }) => { }} />
      </Map>
    </div>
  )
}

export default CustomMap;
