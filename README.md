# Crypto Tracker

A lightweight web application for tracking live cryptocurrency prices, market capitalization, and 24h trends.

Live Demo: https://crypto-tracker-peach-nine.vercel.app/

## Features

- Real-time market data ingestion via CoinGecko REST API (Price, 24h Change, Market Cap).
- Instant in-memory search by coin name and ticker symbol.
- Category filters (Top 10, Gainers, Losers).
- Tri-state price sorting (Descending -> Ascending -> Default rank).
- Watchlist with localStorage persistence and "Favorites Only" view mode.
- Manual data refresh with last updated timestamp.

## Tech Stack

- HTML5 (Semantic tables)
- CSS3 (Flexbox, Dark theme)
- Vanilla JavaScript (Fetch API, Async/Await, Array Methods, LocalStorage)
