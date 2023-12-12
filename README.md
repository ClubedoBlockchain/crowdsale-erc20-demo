# Crowdsale ERC-20 Demo

It's a Crowdsale Smart Contract with fixed minted Tokens at creation and Know Your Customer (KYC) implementation for cases where it's necessary. 
The implemented RUST backend simulates  a contract management by the server side using same Wallet MNEMONIC that was used at contract creation. 
In this prototype project, RUST backend will be used to update de list of KYC approved users.

[Live Demo](https://clubedoblockchain.github.io/crowdsale-erc20-demo/)


![Crowdsale](https://user-images.githubusercontent.com/19849921/189179464-3c658edc-034d-42fc-b078-227b195b564d.png)


## Stack

RUST, Solidity, JavaScript, React, GitHub Actions, and AWS Lambda.

## Truffle and React

First ensure you are in an empty directory.

Run the `unbox` command using 1 of 2 ways.

```sh
# Install Truffle globally and run `truffle unbox`
$ npm install -g truffle
```

Start the react dev server.

```sh
$ cd client
$ npm start
  Starting the development server...
```
You can use GANACHE to run a local blockchain and change truffle.config.ts to connect to your endpoint. Default installation for Ganache will run the blockchain at 7545 port, but for development you can use Truffle development network, check truffle documentation to get details.

__Where can I find more resources?__

  This Box is a sweet combo of [Truffle](https://trufflesuite.com) and [Create React App](https://create-react-app.dev). Either one would be a great place to start!

## Cargo
If you don't know RUST, you can implement the same functionality using a simple Express.js API and deploy to AWS Lambda.
To install Cargo you need check [The Book](https://doc.rust-lang.org/cargo/commands/cargo-install.html)

The compilation runtime depends of your machine, but you can install other runtime using rustup. A quick install of the dependencies in sign_on_rust folder will give you all that you need to build a binary.
Cargo Lambda package has some heavy dependencies and could demand a good time and effort to install.

