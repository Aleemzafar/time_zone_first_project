import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const MapComponent = () => {
  // Set map container style
  const containerStyle = {
    width: "100%",
    height: "400px",
  };
  const center = {
    lat: 31.5497, // Latitude for Chuburji Chowk
    lng: 74.3082, // Longitude for Chuburji Chowk
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15} // Adjust the zoom level
      >
        {/* Add a marker at Chuburji Chowk */}
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
