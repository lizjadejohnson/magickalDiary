import React, { useRef, useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const mapId = 'f21752833355c847';  // Your actual Map ID

const MapComponent = ({ initialCoordinates, setLocationOfBirth }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API,
    libraries,
  });

  const mapRef = useRef();
  const autocompleteRef = useRef();
  const markerRef = useRef(null);
  const infoWindowRef = useRef(null);

  const onMapLoad = async (map) => {
    mapRef.current = map;

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    if (initialCoordinates && initialCoordinates.lat !== null && initialCoordinates.lng !== null) {
      map.setCenter(initialCoordinates);
      map.setZoom(15);

      const newMarker = new AdvancedMarkerElement({
        map,
        position: initialCoordinates,
      });

      markerRef.current = newMarker;

      const newInfoWindow = new google.maps.InfoWindow({
        content: `<div class="custom-info-window"><strong>Selected Location</strong><br>Lat: ${initialCoordinates.lat}, Lng: ${initialCoordinates.lng}</div>`,
      });

      newInfoWindow.open(map, newMarker);
      infoWindowRef.current = newInfoWindow;
    }

    map.addListener('click', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setLocationOfBirth({ lat, lng });

      console.log(`Clicked location: Lat: ${lat}, Lng: ${lng}`);

      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }

      const newMarker = new AdvancedMarkerElement({
        map,
        position: { lat, lng },
      });

      markerRef.current = newMarker;

      const newInfoWindow = new google.maps.InfoWindow({
        content: `<div class="custom-info-window"><strong>Selected Location</strong><br>Lat: ${lat}, Lng: ${lng}</div>`,
      });

      newInfoWindow.open(map, newMarker);
      infoWindowRef.current = newInfoWindow;
    });
  };

  const onPlaceChanged = async () => {
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry) return;

    const location = place.geometry.location;
    const lat = location.lat();
    const lng = location.lng();
    setLocationOfBirth({ lat, lng });

    console.log(`Selected place: Lat: ${lat}, Lng: ${lng}`);

    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(15);

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    if (markerRef.current) {
      markerRef.current.setMap(null);
    }
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    const newMarker = new AdvancedMarkerElement({
      map: mapRef.current,
      position: { lat, lng },
      title: place.name,
    });

    markerRef.current = newMarker;

    const newInfoWindow = new google.maps.InfoWindow({
      content: `<div class="custom-info-window"><strong>${place.name}</strong><br>${place.formatted_address}</div>`,
    });

    newInfoWindow.open(mapRef.current, newMarker);
    infoWindowRef.current = newInfoWindow;
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
      <Autocomplete onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)} onPlaceChanged={onPlaceChanged}>
        <input type="text" placeholder="Search for your place of birth" className='location-search' />
      </Autocomplete>
      <p className='text-tip center-text'>Feel free to manually select an area on map if precise location is not known.</p>
      <GoogleMap
        mapContainerClassName='map-container'
        zoom={2}
        center={initialCoordinates || { lat: 25, lng: -40 }}
        onLoad={onMapLoad}
        options={{
          mapId: mapId,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
        }}
      />
    </div>
  );
};

export default MapComponent;
