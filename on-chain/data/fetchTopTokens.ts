import axios from "axios";
require("dotenv").config();

async function fetchTopTokens(
    apiKey: string
): Promise<{ symbol: string; price: number; marketCap: number }[]> {
    try {
        // Set up the API endpoint and parameters
        const apiUrl =
            "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
        const parameters = {
            start: "1",
            limit: "20", // Adjust the limit based on your needs
            convert: "USD", // You can change the currency if needed
        };

        // Set up the headers with the CoinMarketCap API key
        const headers = {
            "X-CMC_PRO_API_KEY": apiKey,
        };

        // Make the API request
        const response = await axios.get(apiUrl, {
            params: parameters,
            headers,
        });

        // Extract the list of tokens with symbol and market cap from the response
        const topTokens: {
            symbol: string;
            price: number;
            marketCap: number;
        }[] = response.data.data.map((token: any) => ({
            symbol: token.symbol,
            price: Number(token.quote.USD.price).toFixed(2),
            marketCap: Math.round(token.quote.USD.market_cap),
        }));

        return topTokens;
    } catch (error) {
        console.error("Error fetching top tokens:");
        throw error;
    }
}

// get the api key from ENV file
// const CMC_API_KEY = process.env.CMC_API_KEY;

// console.log(CMC_API_KEY);

// // Check if the CoinMarketCap API key is defined
// if (!CMC_API_KEY) {
//     console.error("CoinMarketCap API key is not defined.");
//     process.exit(1); // Exit with an error code
// }

// Call the function and log the result
fetchTopTokens("26c06b9c-a40e-44c1-8bf8-6162ec5619ac")
    .then((topTokens) => {
        console.log("Top Tokens:", topTokens);
    })
    .catch((error) => {
        console.error("Error:", error.message);
    });
