// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add a marker
const marker = L.marker([51.505, -0.09]).addTo(map);
marker.bindPopup('You are here').openPopup();

// AR button handler
document.getElementById('ar-button').addEventListener('click', () => {
    const arContainer = document.getElementById('ar-container');
    const mapDiv = document.getElementById('map');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser does not support camera access. Please use a supported browser.");
        return;
    }

    if (arContainer.innerHTML === '') {
        // Dynamically create AR scene
        arContainer.innerHTML = `
            <a-scene embedded arjs>
                <a-box position="0 0.5 0" material="color: red;"></a-box>
                <a-marker-camera preset="hiro"></a-marker-camera>
            </a-scene>
        `;

        mapDiv.style.display = 'none';

        // Explicitly request camera access
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(() => console.log("Camera access granted."))
            .catch(err => {
                console.error("Camera access denied:", err);
                alert("Unable to access the camera. Please check your browser settings.");
            });
    } else {
        // Remove AR scene
        arContainer.innerHTML = '';
        mapDiv.style.display = 'block';
    }
});
