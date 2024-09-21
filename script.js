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
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

async function getNearbyPlaces(location, hotelBudget, shopBudget) {
    let radius = 1000;
    let overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(node["tourism"="hotel"](around:${radius},${location.lat},${location.lng});node["shop"](around:${radius},${location.lat},${location.lng}););out body;`;

    let response = await fetch(overpassUrl);
    let data = await response.json();

    let hotels = data.elements.filter(place => place.tags.tourism === 'hotel');
    let shops = data.elements.filter(place => place.tags.shop);

    displayPlaces(hotels, 'hotelList', hotelBudget);
    displayPlaces(shops, 'shopList', shopBudget);
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
