## Continuum

Continuum is a crypto index fund implemented as a smart contract on the Ethereum blockchain using Solidity. It tracks top 10 cryptocurrency based on the marketcap and utilizes automation for rebalancing. The fund fetches data from CoinMarketCap's API and Chainlink's on-chain data to maintain accurate asset allocation.


## Features

- **Smart Rebalancing:** The fund automatically adjusts its holdings to maintain the desired allocation according to the predefined index.
- **Data Fetching:** Utilizes CoinMarketCap's API and Chainlink's on-chain data for real-time pricing and market data.
- **Security:** Implemented as a smart contract on the Ethereum blockchain, ensuring transparency and security of fund operations.
- **ERO20 Token:** The fund issues ERO20 tokens representing ownership in the index fund, allowing users to easily buy, sell, and trade their holdings.

## Getting Started

To deploy and interact with the ERO20 Token crypto index fund, follow these steps:

1. **Installation:**
   - Clone the repository:
     ```
     git clone https://github.com/pingyujc/continuum.git
     ```
   - Install dependencies:
     ```
     cd on-chain
     npm install
     ```

2. **Deploy Smart Contract:**
   - Deploy the smart contract to the Ethereum blockchain using tools like Remix or Truffle.

3. **Interact with the Fund:**
   - Use web3.js or ethers.js to interact with the deployed smart contract.
   - Functions like buy, sell, and transfer tokens can be called to manage holdings.

## Usage

Here's how users can utilize the ERO20 Token crypto index fund:

- **Investment:** Users can invest in the index fund by purchasing ERO20 tokens.
- **Rebalancing:** The fund automatically rebalances its holdings to maintain the desired asset allocation.
- **Redemption:** Users can redeem their ERO20 tokens for their share of the fund's assets.


## License

This project is licensed under the MIT License

## Acknowledgments

- CoinMarketCap for providing cryptocurrency market data.
- Chainlink for on-chain data solutions.
- Ethereum for the underlying blockchain technology.

