document.getElementById('budgetForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    let totalBudget = document.getElementById('totalBudget').value;
    let hotelPercent = document.getElementById('hotelBudget').value;
    let shopPercent = document.getElementById('shopBudget').value;

    let hotelBudget = (totalBudget * (hotelPercent / 100)).toFixed(2);
    let shopBudget = (totalBudget * (shopPercent / 100)).toFixed(2);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            let userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            await getNearbyPlaces(userLocation, hotelBudget, shopBudget);
            initMap(userLocation);
            createPieChart(hotelBudget, shopBudget);
        }, function(error) {
            alert("Error getting location: " + error.message);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

async function getNearbyPlaces(location, hotelBudget, shopBudget) {
    let radius = 1000; // 1 km
    let overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(node["tourism"="hotel"](around:${radius},${location.lat},${location.lng});node["shop"](around:${radius},${location.lat},${location.lng}););out body;`;

    try {
        let response = await fetch(overpassUrl);
        if (!response.ok) throw new Error("Network response was not ok");
        let data = await response.json();

        let hotels = data.elements.filter(place => place.tags.tourism === 'hotel');
        let shops = data.elements.filter(place => place.tags.shop);

        displayPlaces(hotels, 'hotelList', hotelBudget);
        displayPlaces(shops, 'shopList', shopBudget);
    } catch (error) {
        console.error("Failed to fetch nearby places: ", error);
    }
}

function displayPlaces(places, elementId, budget) {
    let list = document.getElementById(elementId);
    list.innerHTML = ''; 

    places.forEach(place => {
        let li = document.createElement('li');
        let placeName = place.tags.name || 'Unnamed';
        li.textContent = `${placeName} - Estimated Cost: Rs.${(Math.random() * budget).toFixed(2)}`;
        list.appendChild(li);
    });
}

function initMap(location) {
    let map = L.map('map').setView([location.lat, location.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // Add a marker for the user's location
    L.marker([location.lat, location.lng]).addTo(map).bindPopup("You are here!").openPopup();
}

function createPieChart(hotelBudget, shopBudget) {
    const ctx = document.getElementById('chartContainer').getContext('2d');
    const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Hotel Budget', 'Shop Budget'],
            datasets: [{
                data: [hotelBudget, shopBudget],
                backgroundColor: ['#4CAF50', '#2196F3'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Budget Distribution'
                }
            }
        }
    });
}
