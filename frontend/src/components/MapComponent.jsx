import React, { useRef, useEffect, useContext } from 'react';
import { GoogleMap, useLoadScript, Autocomplete } from '@react-google-maps/api';
import { UserContext } from '../../utilities/UserContext';



const libraries = ['places'];
const mapId = 'f21752833355c847'; // Your actual Map ID

const MapComponent = ({ setLocationOfBirth }) => {
  const { user } = useContext(UserContext);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API,
    libraries,
  });

  const mapRef = useRef();
  const autocompleteRef = useRef();
  const markerRef = useRef(null);
  const infoWindowRef = useRef(null);

  useEffect(() => {
    if (isLoaded && user && user.locationOfBirth) {
      initializeMap(user.locationOfBirth);
    }
  }, [isLoaded, user]);

  const initializeMap = async (initialLocation) => {
    if (!mapRef.current) return;

    mapRef.current.panTo(initialLocation);
    mapRef.current.setZoom(15);

    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

    if (markerRef.current) {
      markerRef.current.setMap(null);
    }
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    const newMarker = new AdvancedMarkerElement({
      position: initialLocation,
      map: mapRef.current,
    });

    markerRef.current = newMarker;

    const newInfoWindow = new google.maps.InfoWindow({
      content: `<div class="custom-info-window"><strong>Selected Location</strong><br>Lat: ${initialLocation.lat}, Lng: ${initialLocation.lng}</div>`,
    });

    newInfoWindow.open(mapRef.current, newMarker);
    infoWindowRef.current = newInfoWindow;
  };

  const onMapLoad = (map) => {
    mapRef.current = map;

    if (user && user.locationOfBirth) {
      initializeMap(user.locationOfBirth);
    } else {
      // Default to a neutral location, e.g., center of the ocean
      mapRef.current.setCenter({ lat: 25, lng: -40 });
      mapRef.current.setZoom(2);
    }

    map.addListener('click', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setLocationOfBirth({ lat, lng });

      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }

      const newMarker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat, lng },
        map: mapRef.current,
      });

      markerRef.current = newMarker;

      const newInfoWindow = new google.maps.InfoWindow({
        content: `<div class="custom-info-window"><strong>Selected Location</strong><br>Lat: ${lat}, Lng: ${lng}</div>`,
      });

      newInfoWindow.open(mapRef.current, newMarker);
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

    if (!mapRef.current) return;

    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(15);

    if (markerRef.current) {
      markerRef.current.setMap(null);
    }
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    const newMarker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat, lng },
      map: mapRef.current,
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
    <div className='location-of-birth-container'>
      <Autocomplete onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)} onPlaceChanged={onPlaceChanged}>
        <input type='text' placeholder='Search for your place of birth' className='location-search' />
      </Autocomplete>
      <p className='text-tip center-text'>Feel free to manually select an area on map if precise location is not known.</p>
      <GoogleMap
        mapContainerClassName='map-container'
        zoom={user && user.locationOfBirth ? 15 : 2} // Adjust zoom based on whether user.locationOfBirth is available
        center={user && user.locationOfBirth ? user.locationOfBirth : { lat: 25, lng: -40 }} // Use user.locationOfBirth if available, else default to middle of the ocean
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