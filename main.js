// Crypto Tracker

const loader = document.querySelector("#loader");
const loadingStatus = document.querySelector("#loading-status");
const cryptoTableBody = document.querySelector("#crypto-table-body");
const searchInput = document.querySelector("#search-input");
const filterSelect = document.querySelector("#filter-select");
const favoritesToggleButton = document.querySelector("#favorites-toggle-btn");
const sortPrice = document.querySelector("#sort-price");
const refreshButton = document.querySelector("#refresh-btn");
const lastUpdate = document.querySelector("#last-updated");

let favorites = JSON.parse(localStorage.getItem("cryptoFavorites"));

if (favorites === null) {
    favorites = [];
}

let isFavoritesOnly = false;

favoritesToggleButton.addEventListener("click", () => {
    isFavoritesOnly = !isFavoritesOnly;
    
    if (isFavoritesOnly === true) {
        favoritesToggleButton.classList.add("active");
    } else {
        favoritesToggleButton.classList.remove("active");
    }

    filterCoins();
});

let cryptoData = [];

const getCryptoData = async () => {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=50&page=1");

        if (response.ok === false) {
            throw new Error("API error");
        }

        cryptoData = await response.json();

        loader.classList.add("hidden");

        renderTable(cryptoData);
    } catch (error) {
        console.error(`Error: ${error}`);
        loadingStatus.textContent = `Sorry, we couldn't load the data. Please try again`;
    }
};

const renderTable = (coins) => {
    cryptoTableBody.innerHTML = "";

    cryptoTableBody.innerHTML = coins.map(coin => {
        let starIcon = "☆";

        if (favorites.includes(coin.id)) {
            starIcon = "⭐️";
        }

         return `<tr>
            <td>${coin.market_cap_rank}</td>
            <td class="left-info">
                <span class="coin-info">
                    <img src="${coin.image}" alt="${coin.name}">
                    <span class="coin-name">${coin.name} (${coin.symbol.toUpperCase()})</span>
                </span>
            </td>
            <td class="right-info"><span class="coin-price">$${coin.current_price.toFixed(3)}</span></td>
            <td><span class="coin-price-change">${Number(coin.price_change_percentage_24h).toFixed(2)}%</span></td>
            <td>$${coin.market_cap.toLocaleString()}</td>
            <td>
                <button class="fav-btn" data-id="${coin.id}">${starIcon}</button>
            </td>
        </tr>
    `}).join("");
};

// Filter coins logic
const filterCoins = () => {
    const userCoinSearch = searchInput.value.trim().toLowerCase();

    const selectedFilter = filterSelect.value;

    let result = cryptoData.filter(coin => coin.name.trim().toLowerCase().includes(userCoinSearch) || coin.symbol.toLowerCase().includes(userCoinSearch));

    if (selectedFilter === "all") {

    } else if (selectedFilter === "top10") {
        result = result.slice(0, 10);
    } else if (selectedFilter === "gainers") {
        result = result.filter(coin => coin.price_change_percentage_24h > 0);
    } else {
        result = result.filter(coin => coin.price_change_percentage_24h < 0);
    }

    if (isFavoritesOnly === true) {
        result = result.filter(coin => favorites.includes(coin.id));
    }

    if (currentSort === "desc") {
        result.sort((a, b) => b.current_price - a.current_price);
    } else if (currentSort === "asc") {
        result.sort((a, b) => a.current_price - b.current_price);
    }

    renderTable(result);
};

searchInput.addEventListener("input", () => {
    filterCoins();
});

filterSelect.addEventListener("change", () => {
    filterCoins();
});

cryptoTableBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("fav-btn")) {
        const targetCoinId = event.target.dataset.id;

        if (favorites.includes(targetCoinId)) {
            favorites = favorites.filter(id => id !== targetCoinId);
            event.target.textContent = "☆";
        } else {
            favorites.push(targetCoinId);
            event.target.textContent = "⭐️";
        }

        localStorage.setItem("cryptoFavorites", JSON.stringify(favorites));
        filterCoins();
    }
});

let currentSort = "default";

sortPrice.addEventListener("click", () => {
    if (currentSort === "default") {
        currentSort = "desc";
        sortPrice.textContent = "Price 🔽";
    } else if (currentSort === "desc") {
        currentSort = "asc";
        sortPrice.textContent = "Price 🔼";
    } else if (currentSort === "asc") {
        currentSort = "default";
        sortPrice.textContent = "Price ⬍";
    }

    filterCoins();
});

refreshButton.addEventListener("click", async () => {
    await getCryptoData();

    filterCoins();

    lastUpdate.textContent = new Date().toLocaleTimeString().slice(0, 8);
});

getCryptoData();