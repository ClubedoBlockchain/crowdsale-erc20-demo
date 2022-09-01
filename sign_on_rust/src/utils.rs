
use ethers::signers::{MnemonicBuilder, coins_bip39::English, LocalWallet};

// Get key MNEMONIC KEY
pub fn key(index: u32, mnemonic: &str) -> LocalWallet {
    MnemonicBuilder::<English>::default().phrase(mnemonic).index(index).unwrap().build().unwrap()
}