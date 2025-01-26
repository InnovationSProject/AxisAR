let map;
let marker;
let selectedLocation = null;

// Initialize the map
function initMap() {
  const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // New York
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: defaultLocation,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  });

  // Add click listener to map
  map.addListener('click', (e) => {
    const location = e.latLng.toJSON();
    setSelectedLocation(location);
  });

  // Initialize UI elements
  initializeUI();
}

function initializeUI() {
  const locationBtn = document.getElementById('location-btn');
  const startNavBtn = document.getElementById('start-nav-btn');
  const backBtn = document.getElementById('back-btn');

  locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(location);
        setSelectedLocation(location);
      });
    }
  });

  startNavBtn.addEventListener('click', startARNavigation);
  backBtn.addEventListener('click', () => {
    document.getElementById('map-view').classList.add('active');
    document.getElementById('ar-view').classList.remove('active');
    stopARNavigation();
  });
}

function setSelectedLocation(location) {
  selectedLocation = location;
  
  // Update or create marker
  if (marker) {
    marker.setMap(null);
  }
  marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 7,
      fillColor: "#4285F4",
      fillOpacity: 1,
      strokeColor: "#FFFFFF",
      strokeWeight: 2,
    },
  });

  // Show start navigation button
  document.getElementById('start-nav-btn').style.display = 'block';
}

async function startARNavigation() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    const videoElement = document.getElementById('camera-feed');
    videoElement.srcObject = stream;

    document.getElementById('map-view').classList.remove('active');
    document.getElementById('ar-view').classList.add('active');

    // Start AR navigation logic here
    // This would include device orientation handling and arrow rendering
    startARTracking();
  } catch (error) {
    console.error('Error accessing camera:', error);
    alert('Unable to access camera. Please ensure you have granted camera permissions.');
  }
}

function startARTracking() {
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation);
  }
}

function stopARNavigation() {
  const videoElement = document.getElementById('camera-feed');
  const stream = videoElement.srcObject;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  window.removeEventListener('deviceorientation', handleOrientation);
}

function handleOrientation(event) {
  // Here you would implement the logic to show direction arrows
  // based on device orientation and selected location
  const overlay = document.getElementById('ar-overlay');
  // Implementation of AR direction arrows would go here
}

// Initialize map when the script loads
window.initMap = initMap;