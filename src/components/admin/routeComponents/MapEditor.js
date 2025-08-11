import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';

// This component captures map click events to add new stops.
const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
};

const MapEditor = ({ stops, setStops }) => {
    // New Orleans, LA coordinates
    const initialPosition = [29.9511, -90.0715];

    const handleMapClick = (latlng) => {
        const newStopName = `Stop ${stops.length + 1}`;
        setStops([...stops, { name: newStopName, lat: latlng.lat, lng: latlng.lng }]);
    };

    const stopPositions = stops.map(stop => [stop.lat, stop.lng]);

    return (
        <MapContainer center={initialPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="[https://www.openstreetmap.org/copyright](https://www.openstreetmap.org/copyright)">OpenStreetMap</a> contributors'
            />
            <MapClickHandler onMapClick={handleMapClick} />
            {stops.map((stop, index) => (
                <Marker key={index} position={[stop.lat, stop.lng]} />
            ))}
            {stopPositions.length > 1 && (
                <Polyline pathOptions={{ color: 'blue' }} positions={stopPositions} />
            )}
        </MapContainer>
    );
};

export default MapEditor;