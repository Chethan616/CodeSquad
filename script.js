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
    // (existing code)

    // Add markers for hotels
    hotels.forEach(hotel => {
        if (hotel.lat && hotel.lon) {
            const marker = L.marker([hotel.lat, hotel.lon]).addTo(map);
            marker.bindPopup(`${hotel.tags.name || 'Unnamed Hotel'} - Estimated Cost: Rs.${(Math.random() * hotelBudget).toFixed(2)}`);
        }
    });

    // Add markers for shops
    shops.forEach(shop => {
        if (shop.lat && shop.lon) {
            let shopIcon;

            // Select the appropriate icon based on shop type
            switch (shop.tags.shop) {
                case "general":
                    shopIcon = generalShopIcon;
                    break;
                case "gifts":
                    shopIcon = giftsShopIcon;
                    break;
                case "food":
                    shopIcon = foodShopIcon;
                    break;
                default:
                    shopIcon = redShopIcon; // Fallback icon
            }

            const marker = L.marker([shop.lat, shop.lon], { icon: shopIcon }).addTo(map);
            marker.bindPopup(`${shop.tags.name || 'Unnamed Shop'} - Estimated Cost: Rs.${(Math.random() * shopBudget).toFixed(2)}`);
        }
    });
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
