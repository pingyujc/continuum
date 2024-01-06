import axios from "axios";
import dotenv from "dotenv";
import path from "path";

// function definitions:

// this function should fetch the top tokens, sorted by marketcap.
async function fetchTopTokens(
    apiKey: string
): Promise<{ id: number; symbol: string; price: number; marketCap: number }[]> {
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

        // print out the response
        // console.log("response:", response.data.data);

        // Extract the list of tokens with id, symbol, price, and market cap from the response
        const topTokens: {
            id: number;
            symbol: string;
            price: number;
            marketCap: number;
        }[] = response.data.data.map((token: any) => ({
            id: token.id,
            symbol: token.symbol,
            price: Number(token.quote.USD.price).toFixed(2),
            marketCap: Math.round(token.quote.USD.market_cap),
        }));

        // filter out here
        // console.log("TOP:", topTokens);

        return topTokens;
    } catch (error) {
        console.error("Error fetching top tokens:");
        throw error;
    }
}

// this should get the top 10, without stable coins
// this function does not call the API
async function getTop10(
    tokenArray: Promise<
        { id: number; symbol: string; price: number; marketCap: number }[]
    >,
    apiKey: string
): Promise<{ id: number; symbol: string; weight: number }[]> {
    try {
        // Wait for the promise to resolve
        const tokens = await tokenArray;

        // Filter out stable coins (see if price == 1)
        const filteredTokens = tokens.filter((token) => token.price != 1);

        // Take the top 10 tokens based on market cap
        const topTenArray = filteredTokens.slice(0, 10);

        let total_mcap = 0;

        // Calculate the total market cap of the 10 coins
        for (const token of topTenArray) {
            total_mcap += token.marketCap;
        }

        // Calculate individual weights and build the top10 array
        const top10: { id: number; symbol: string; weight: number }[] =
            topTenArray.map((token) => ({
                id: token.id,
                symbol: token.symbol,
                weight: Number((token.marketCap / total_mcap) * 100),
            }));

        console.log("total marketcap: ", total_mcap);

        return top10;
    } catch (error) {
        console.error("Error getting top 10 tokens:");
        throw error;
    }
}

async function fetchMapping(apiKey: string) {
    try {
        // Prepare the API request parameters
        const apiUrl =
            "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map";
        const parameters = {
            start: 1,
            limit: 30,
            sort: "cmc_rank",
        };

        // Set up the headers with the CoinMarketCap API key
        const headers = {
            "X-CMC_PRO_API_KEY": apiKey,
        };

        // Use await to wait for the result of the API request
        console.log("Request Parameters:", parameters);

        const response = await axios.get(apiUrl, {
            params: parameters,
            headers: headers,
        });

        const mappingData = response.data.data;
        console.log("Mapping Data:", mappingData);
    } catch (error) {
        console.error("Error fetching mapping:");
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

// Check if the CoinMarketCap API key is defined
if (!CMC_API_KEY) {
    console.error("CoinMarketCap API key is not defined.");
    process.exit(1); // Exit with an error code
}

const tokenList = fetchTopTokens(CMC_API_KEY);
getTop10(tokenList, CMC_API_KEY)
    .then((topTenArray) => {
        console.log("Top 10 Tokens:", topTenArray);
    })
    .catch((error) => {
        console.error("Error:", error.message);
    });

// fetchMapping(CMC_API_KEY);
