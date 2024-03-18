// Map.js

import React, { useState, useEffect } from 'react';
import Header from '../Header';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { GiPlagueDoctorProfile } from "react-icons/gi";
import 'leaflet/dist/leaflet.css';

const friendsLocation = [
    {
        id: 1,
        name: 'premkanth',
        latitude: `15°52'19.2"N`,
    }
]

const Map = ({ user }) => {
  const [friendsLocations, setFriendsLocations] = useState([]);
  const [map, setMap] = useState(null);

  function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handleError);
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
    }

    function showPosition(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;


        const friendsLocation = [
            {
                id: 1,
                name: 'premkanth',
                latitude: latitude,
                longitude: longitude,
                profilePhoto: '../Images/no-profile-photo.jpg'
            }
        ]
        
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        setFriendsLocations(friendsLocation)
        
        // Call any function that requires latitude and longitude here
    }

    function handleError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                console.error("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.error("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                console.error("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                console.error("An unknown error occurred.");
                break;
        }
    }

    // Call getLocation function to start retrieving the location
    getLocation();


  /*useEffect(() => {
    // Fetch friends' locations upon component mount
    const fetchFriendsLocations = async () => {
      try {
        const response = await axios.get(`/api/friends/locations/${user.id}`); // Endpoint to fetch friends' locations
        setFriendsLocations(response.data);
      } catch (error) {
        console.error('Error fetching friends\' locations:', error);
      }
    };

    if (user) {
      fetchFriendsLocations();
    }
  }, [user]); */

  useEffect(() => {
    if (map) {
      friendsLocations.forEach(friendLocation => {
        // Create a custom icon for the marker with the profile photo
        const customIcon = L.divIcon({
          html: `<div><img src="${friendLocation.profilePhoto}" alt="${friendLocation.name}" style="width: 32px; height: 32px; border-radius: 50%;"></div>`,
          iconSize: [32, 32], // Adjust icon size as needed
          iconAnchor: [16, 32], // Anchor point of the icon
        });

        // Add marker with custom icon
        const marker = L.marker([friendLocation.latitude, friendLocation.longitude], { icon: customIcon });
        marker.addTo(map).bindPopup(`<b>${friendLocation.name}</b>'s Location`);
      });
    }
  }, [friendsLocations, map]);

  return (
    <>
    <Header />
    <div className="map-container">
      <MapContainer center={[0, 0]} zoom={2} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {friendsLocations.map(friendLocation => (
          <Marker position={[friendLocation.latitude, friendLocation.longitude]} key={friendLocation.id}>
            <Popup>
              {friendLocation.name}'s Location
              <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' alt={friendLocation.name} style={{ width: '100px', height: '100px' }} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
    </>
  );
};

export default Map;
