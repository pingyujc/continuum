//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract TTC_upgradeable is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable
{
    // use initilizer instead of constructor

    // constructor(
    //     address initialOwner
    // ) ERC20("Top Ten Coin", "TTC") Ownable(initialOwner) {}

    function initialize() external initializer {
        __ERC20_init("Top Ten Coin", "TTC");
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}
