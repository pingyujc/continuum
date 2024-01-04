import axios from "axios";
import dotenv from "dotenv";
import { totalmem } from "os";
import path from "path";

// function definitions:

// this function should fetch the top tokens, sorted by marketcap.
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

// this should get the top 10, without stable coins
// this function does not call the API
async function getTop10(
    tokenArray: Promise<{ symbol: string; price: number; marketCap: number }[]>
): Promise<{ symbol: string; price: number; marketCap: number }[]> {
    try {
        // Wait for the promise to resolve
        const tokens = await tokenArray;
        let topTenArray = [];
        for (let i = 0; i < tokens.length; i++) {
            // console.log(tokens[i]);
            if (tokens[i].price != 1.0) {
                topTenArray.push(tokens[i]);
            } else {
                console.log("found stablecoin:", tokens[i].symbol);
            }
        }
        // Take the top 10 tokens
        topTenArray = topTenArray.slice(0, 10);

        let top10: { symbol: string; weight: number }[] = [];

        let total_mcap = 0;
        // first sum up the market cap of the 10 coins
        for (let i = 0; i < topTenArray.length; i++) {
            // console.log(tokens[i]);
            total_mcap += topTenArray[i].marketCap;
        }

        // then calculate the individual weight
        for (let i = 0; i < topTenArray.length; i++) {
            // console.log(tokens[i]);
            let weight = Number((topTenArray[i].marketCap / total_mcap) * 100);
            top10.push({ symbol: topTenArray[i].symbol, weight });
        }

        console.log("total marketcap: ", total_mcap);
        console.log(top10);

        return topTenArray;
    } catch (error) {
        console.error("Error getting top 10 tokens:");
        throw error;
    }
}

// this part is where we call the function and APIs

// Specify the path to your .env file (env is in the on-chain folder)
const envFilePath = path.resolve(__dirname, "../.env");

// Load environment variables from the specified file
dotenv.config({ path: envFilePath });

// get the api key from ENV file
const CMC_API_KEY = process.env.CMC_API_KEY;

console.log("api key is :", CMC_API_KEY);

// Check if the CoinMarketCap API key is defined
if (!CMC_API_KEY) {
    console.error("CoinMarketCap API key is not defined.");
    process.exit(1); // Exit with an error code
}

// Call the function and log the result
// fetchTopTokens(CMC_API_KEY)
//     .then((topTokens) => {
//         console.log("Top Tokens:", topTokens);
//     })
//     .catch((error) => {
//         console.error("Error:", error.message);
//     });

const tokenList = fetchTopTokens(CMC_API_KEY);
getTop10(tokenList)
    .then((topTenArray) => {
        console.log("Top 10 Tokens:", topTenArray);
    })
    .catch((error) => {
        console.error("Error:", error.message);
    });
