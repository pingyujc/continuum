//SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
// import '@uniswap/v3-periphery/contracts/interfaces/external/IWETH9.sol';
import "./IWETH.sol";
import "./TTC.sol";

contract ContinuumVault {
    TTC public ttcToken;
    address public owner;

    // what is this address?
    address payable public constant continuumTreasury =
        payable(0x5a0A32D09A3d31C1cB264a38ECF03ff53fAcE222);
    uint8 public constant continuumFee = 1;

    ISwapRouter public constant swapRouter =
        ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    uint24 public constant poolFee = 10000;

    address public constant wethAddress =
        0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6;

    // each token stores the weight of the token in the TTC and the address
    // for exmaple, Token(50, wethAddress);
    struct Token {
        uint weight;
        address tokenAddress;
    }

    struct TokenInfo {
        string name;
        string symbol;
        uint8 decimals;
        address tokenAddress;
        uint weight;
        uint balance;
    }

    // storing the top 10 tokens in the list?
    // so when rebalancing, we can update the list
    // clean the list -> insert new top 10.
    Token[10] topTenTokens;

    event Minted(address indexed sender, uint256 ethAmount, uint256 ttcAmount);
    event Redemption(address indexed sender, uint256 ttcAmount);

    // this is what the TTC is consisted of, currently just 3 coins and static weight.
    constructor() {
        owner = msg.sender;
        ttcToken = new TTC(address(this));
        // WETH
        topTenTokens[0] = Token(50, wethAddress);
        // Chainlink
        topTenTokens[1] = Token(25, 0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        // Uniswap
        topTenTokens[2] = Token(25, 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984);
    }

    function getTokens() public view returns (Token[10] memory) {
        return topTenTokens;
    }

    function getTtcTokenAddress() public view returns (address) {
        return address(ttcToken);
    }

    function getVaultData() public view returns (TokenInfo[] memory) {
        TokenInfo[] memory data = new TokenInfo[](topTenTokens.length);
        for (uint i = 0; i < topTenTokens.length; i++) {
            if (topTenTokens[i].weight != 0) {
                ERC20 token = ERC20(topTenTokens[i].tokenAddress);
                data[i] = TokenInfo(
                    token.name(),
                    token.symbol(),
                    token.decimals(),
                    topTenTokens[i].tokenAddress,
                    topTenTokens[i].weight,
                    token.balanceOf(address(this))
                );
            }
        }
        return data;
    }

    function executeSwap(uint amount, uint index) internal returns (uint) {
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: wethAddress,
                tokenOut: topTenTokens[index].tokenAddress,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        return swapRouter.exactInputSingle(params);
    }

    // a modifier to make sure only onwer can call some functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _; // Continue with the function execution if the modifier check passes
    }

    // // this function will make the new toptenToken array
    // function makeNewTopTenToken(
    //     Token[10] memory newTopTenTokens
    // ) external onlyOwner {}

    // this function should update the currenct TTC weight to new TTC weight
    function updateTopTenTokens(
        uint[] memory weights,
        address[] memory addresses
    ) external onlyOwner {
        // Perform any necessary validation on the input arrays
        require(
            weights.length == addresses.length,
            "Invalid input arrays length"
        );

        // Update the top ten tokens
        // make each pair of weight and address ubti a token and replace the current one
        for (uint i = 0; i < topTenTokens.length; i++) {
            if (i < weights.length && i < addresses.length) {
                topTenTokens[i] = Token({
                    weight: weights[i],
                    tokenAddress: addresses[i]
                });
            } else {
                // If there are fewer elements in the input arrays, reset the remaining elements in the topTenTokens array
                topTenTokens[i] = Token(0, address(0));
            }
        }
    }

    // a rebalance function that check the current top 10 token by mcap and rebalance accordingly.
    function mint() public payable {
        require(msg.value >= 0.01 ether, "Minimum amount to mint is 0.01 ETH");

        uint fee = (continuumFee * msg.value) / 1000;
        if (fee > .001 ether) {
            fee = .001 ether;
        }

        // Transfer Continuum Fee
        continuumTreasury.transfer(fee);

        // Convert ETH to WETH for token swaps
        uint amount = msg.value - fee;

        uint aum = 0;
        aum += IWETH(wethAddress).balanceOf(address(this));

        IWETH(wethAddress).deposit{value: amount}();
        IWETH(wethAddress).approve(address(swapRouter), amount);

        uint totalSupplyTtc = ttcToken.totalSupply();

        for (uint i = 0; i < topTenTokens.length; i++) {
            if (
                topTenTokens[i].weight != 0 &&
                topTenTokens[i].tokenAddress != wethAddress
            ) {
                uint amountToSwap = (amount * topTenTokens[i].weight) / 100;
                uint balance = IERC20(topTenTokens[i].tokenAddress).balanceOf(
                    address(this)
                );
                uint tokensReceived = executeSwap(amountToSwap, i);
                aum += ((balance * amountToSwap) / (tokensReceived));
            }
        }

        uint amountToMint;
        if (totalSupplyTtc > 0) {
            amountToMint = (amount * totalSupplyTtc) / aum;
        } else {
            amountToMint = 1 * (10 ** ttcToken.decimals());
        }
        ttcToken.mint(msg.sender, amountToMint);

        emit Minted(msg.sender, amount, amountToMint);
    }

    function redeem(uint amount) public {
        uint totalSupplyTtc = ttcToken.totalSupply();
        require(totalSupplyTtc > 0, "Vault is empty");
        require(
            amount > 0 && amount <= ttcToken.balanceOf(msg.sender),
            "Invalid amount to redeem"
        );

        for (uint i = 0; i < topTenTokens.length; i++) {
            if (topTenTokens[i].weight != 0) {
                uint balanceOfAsset = IERC20(topTenTokens[i].tokenAddress)
                    .balanceOf(address(this));
                uint amountToTransfer = (balanceOfAsset * amount) /
                    totalSupplyTtc;
                uint fee = amountToTransfer / 1000;
                if (topTenTokens[i].tokenAddress == wethAddress) {
                    // Handle WETH specifically
                    IWETH(wethAddress).withdraw(amountToTransfer);
                    payable(msg.sender).transfer(amountToTransfer - fee);
                    payable(continuumTreasury).transfer(fee);
                } else {
                    require(
                        IERC20(topTenTokens[i].tokenAddress).transfer(
                            msg.sender,
                            amountToTransfer - fee
                        ),
                        "User Transfer failed"
                    );
                    require(
                        IERC20(topTenTokens[i].tokenAddress).transfer(
                            continuumTreasury,
                            fee
                        ),
                        "Treasury Transfer failed"
                    );
                }
            }
        }

        ttcToken.burn(msg.sender, amount);
        emit Redemption(msg.sender, amount);
    }

    receive() external payable {}
}
