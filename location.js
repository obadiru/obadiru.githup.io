"use strict";

function initMap() {
  const displayMap = document.getElementById("displayMap");
  const routeBox = document.getElementById("routeBox");

  const businessLocation = { lat: 43.7854, lng: -79.2264 }; 

  const myMap = new google.maps.Map(displayMap, {
    zoom: 12,
    center: businessLocation,
    fullscreenControl: false,
  });

  new google.maps.Marker({
    position: businessLocation,
    map: myMap,
    title: "My Business Location",
  });

  window.myMap = myMap;
  window.businessLocation = businessLocation;
  window.routeBox = routeBox;
}

function showRoute() {
  const addressInput = document.getElementById("userAddress").value;

  if (!addressInput) {
    alert("Please enter your current address.");
    return;
  }

  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: addressInput }, function (results, status) {
    if (status === "OK") {
      const userLocation = results[0].geometry.location;

      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();

      directionsRenderer.setMap(window.myMap);
      directionsRenderer.setPanel(window.routeBox);

      const routeRequest = {
        origin: userLocation,
        destination: window.businessLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(routeRequest, function (result, status) {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
        } else {
          window.routeBox.textContent = "Unable to find route: " + status;
        }
      });
    } else {
      alert("Address not found: " + status);
    }
  });
}
