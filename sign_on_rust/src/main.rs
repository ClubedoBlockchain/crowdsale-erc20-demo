use ethers::{contract::abigen, prelude::{*, k256::schnorr::Error}};
use serde::{Deserialize, Serialize};

pub mod utils;
extern crate dotenv;
use std::{collections::HashMap, env, str::FromStr, sync::Arc};

use dotenv::dotenv;

use lambda_http::{service_fn, IntoResponse, Request, RequestExt};
use serde_json::{json, Value};

abigen!(BLKTokenKYC, "./contracts/BLKTokenKYC.json", event_derives (serde::Deserialize, serde::Serialize);
);

#[tokio::main]
async fn main() -> Result<(), Error> {
    lambda_http::run(service_fn(func)).await?;
    Ok(())
}

#[derive(Deserialize, Serialize, Debug)]
pub struct NetworkObject<'a> {
    address: &'a str,
    events: serde_json::Value,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct ContractDeployed<'a, NetworkObject> {
    bytecode: &'a str,
    abi: Vec<serde_json::Value>,
    networks: HashMap<String, NetworkObject>,
}

async fn func(request: Request) -> Result<impl IntoResponse, std::convert::Infallible> {
    dotenv().ok();

    let _context = request.lambda_context();

    let query = request.query_string_parameters();

    let transaction = query.first("transaction").unwrap_or_else(|| "completed");
    let address = query
        .first("address")
        .unwrap_or_else(|| "0x0000000000000000000000000000000000000000");
    let network = query.first("network").unwrap_or_else(|| "5");

    let response = run_transaction(transaction.clone(), address.clone(), network.clone());

    Ok(response.await?)
}

async fn run_transaction(
    transaction: &str,
    address: &str,
    network: &str,
) -> Result<Value, std::convert::Infallible> {
    // Get Environments
    let mnemonic = env::var("MNEMONIC").expect("$MNEMONIC is not set");
    let endpoint = env::var("NETWORK_URL").expect("$NETWORK_URL is not set");
    // Gettting the first account in the Wallet
    
    let wallet = utils::key(0, &mnemonic);

    // Getting Provider
    let provider = Provider::try_from(endpoint).expect("Provider not conected");
    //Getting client to sign transactions
    let network_id: u32 = network.parse::<u32>().unwrap();
    let client = Arc::new(SignerMiddleware::new(
        provider,
        wallet.with_chain_id(network_id),
    ));
    
    // Getting contract JSON delivered by truffle
    let contract_json = include_str!("../contracts/BLKTokenKYC.json");
    let contract_deployed: ContractDeployed<NetworkObject> =
        serde_json::from_str(contract_json).unwrap();

    let contract_in_network = contract_deployed
        .networks
        .get(network)
        .expect("Failed to get chainId");

    // 5. deploy contract
    let contract_address = H160::from_str(contract_in_network.address)
        .expect("Error in conversion to contract address");
    let request_address = H160::from_str(address)
        .expect("Error in conversion to client address");
    let kyc_contract = BLKTokenKYC::new(contract_address, client.clone());

    let completed = kyc_contract.completed(request_address);    
    
    let message = if let Err(e) = completed.send().await {
        format!("{:#?}", e )
    } else {
        "Successfully Sent".to_string()
    };

    Ok(json!({ "transaction": transaction, "address": address, "message": message }))
}

#[tokio::test]
async fn test_my_lambda_handler() {
    dotenv().ok();
    let input = include_str!("../files/apigw_proxy_request.json");
    let context = lambda_http::Context::default();
    let mut body = lambda_http::request::from_str(input).expect("failed to create request");

    body = body.with_lambda_context(context);

    let res = func(body).await.expect("failed to handle request");
    println!("{:#?}", res.into_response().await);
}
