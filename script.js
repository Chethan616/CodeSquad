document.getElementById('budgetForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    let totalBudget = parseFloat(document.getElementById('totalBudget').value);
    let hotelPercent = parseFloat(document.getElementById('hotelBudget').value);
    let shopPercent = parseFloat(document.getElementById('shopBudget').value);

    let hotelBudget = (totalBudget * (hotelPercent / 100)).toFixed(2);
    let shopBudget = (totalBudget * (shopPercent / 100)).toFixed(2);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            let userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            await getNearbyPlaces(userLocation, hotelBudget, shopBudget);
            await getBudgetRecommendations(totalBudget, hotelBudget, shopBudget);
            await predictExpenses(totalBudget, hotelBudget, shopBudget);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

async function getNearbyPlaces(location, hotelBudget, shopBudget) {
    let radius = 1000;
    let overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(node["tourism"="hotel"](around:${radius},${location.lat},${location.lng});node["shop"](around:${radius},${location.lat},${location.lng}););out body;`;

    let response = await fetch(overpassUrl);
    if (!response.ok) {
        console.error("Error fetching data from Overpass API:", response.statusText);
        return;
    }

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

async function getBudgetRecommendations(totalBudget, hotelBudget, shopBudget) {
    const recommendations = document.getElementById('recommendations');
    recommendations.innerHTML = '';

    if (totalBudget < 1000) {
        recommendations.innerHTML += `<li>Consider increasing your budget for a better experience.</li>`;
    } else {
        recommendations.innerHTML += `<li>Your budget is adequate for a comfortable stay!</li>`;
    }

    if (hotelBudget < 1000) {
        recommendations.innerHTML += `<li>Consider allocating more for hotels to ensure better quality.</li>`;
    }

    if (shopBudget < 500) {
        recommendations.innerHTML += `<li>Increase your shopping budget for a better experience!</li>`;
    }
}

async function predictExpenses(totalBudget, hotelBudget, shopBudget) {
    const predictedExpenses = document.getElementById('predictedExpenses');
    predictedExpenses.innerHTML = '';

    const randomExpenseFactor = Math.random() * 0.1; // Simulate a 10% variance
    const estimatedHotelExpense = (hotelBudget * (1 + randomExpenseFactor)).toFixed(2);
    const estimatedShopExpense = (shopBudget * (1 + randomExpenseFactor)).toFixed(2);
    const totalEstimatedExpense = (parseFloat(estimatedHotelExpense) + parseFloat(estimatedShopExpense)).toFixed(2);

    predictedExpenses.innerHTML += `<p>Estimated Hotel Expense: Rs. ${estimatedHotelExpense}</p>`;
    predictedExpenses.innerHTML += `<p>Estimated Shop Expense: Rs. ${estimatedShopExpense}</p>`;
    predictedExpenses.innerHTML += `<p>Total Estimated Expense: Rs. ${totalEstimatedExpense}</p>`;
}
