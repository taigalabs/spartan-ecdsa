use super::verify_eth_sig;

#[tokio::test]
async fn test_verify_eth_sig_1() {
    use ethers_signers::{LocalWallet, Signer};
    use k256::ecdsa::SigningKey;

    let sk = "72784c91a7f6320ee5fc0b06004dbf1645769969fbfe2eaa2d4ce13c069eade6";
    let sk_bytes = hex::decode(sk).unwrap();
    let signing_key = SigningKey::from_slice(&sk_bytes).unwrap();
    let vk = signing_key.verifying_key();

    let vk_bytes = vk.to_sec1_bytes();
    println!("vk_bytes: {:?}", vk_bytes);

    let vk_hex = format!("0x{}", hex::encode(&vk_bytes));
    println!("vk_hex: {}", vk_hex);

    let wallet = sk.parse::<LocalWallet>().unwrap();

    // let msg = r#"{a: "가나다"}"#;
    let msg = [
        123, 34, 116, 121, 112, 101, 34, 58, 34, 99, 114, 101, 97, 116, 101, 95, 115, 104, 121, 95,
        112, 111, 115, 116, 34, 44, 34, 116, 111, 112, 105, 99, 95, 105, 100, 34, 58, 34, 48, 120,
        100, 49, 101, 52, 49, 55, 52, 101, 50, 98, 97, 102, 57, 100, 48, 57, 48, 102, 49, 57, 34,
        44, 34, 112, 111, 115, 116, 95, 105, 100, 34, 58, 34, 48, 120, 52, 97, 98, 52, 100, 50, 51,
        101, 98, 100, 50, 97, 101, 99, 54, 99, 100, 56, 48, 97, 98, 101, 99, 98, 99, 54, 99, 51,
        100, 56, 99, 57, 50, 48, 51, 56, 56, 98, 54, 101, 53, 54, 99, 97, 48, 99, 55, 100, 54, 52,
        56, 54, 101, 102, 55, 101, 101, 98, 50, 55, 55, 101, 99, 57, 34, 44, 34, 99, 111, 110, 116,
        101, 110, 116, 34, 58, 34, 60, 112, 62, 227, 133, 129, 227, 132, 183, 227, 133, 142, 227,
        132, 177, 227, 133, 129, 227, 133, 136, 227, 132, 183, 227, 133, 142, 60, 47, 112, 62, 34,
        125,
    ];
    println!("msg: {:?}", msg);

    let sig = wallet.sign_message(&msg).await.unwrap();
    println!("sig: {:?}", sig);

    let sig_bytes = sig.to_vec();
    println!("sig bytes: {:?}", sig_bytes);

    let sig_hex = format!("0x{}", hex::encode(sig_bytes));
    println!("sig_hex: {}", sig_hex);

    let addr2 = verify_eth_sig(&sig_hex, &msg, &vk_hex).unwrap();
    println!("addr: {}", addr2);
}

#[tokio::test]
async fn test_verify_eth_sig_2() {
    let sig_hex = "0xd1ccaa0abd76288668a630e5858ecb8130f9360844d451c9b70aee8b655bc8e11cd0a4ba9e4001a91fedb8c4558055fe332e7578ae91ff5a2ca7a5dad878864e1b";
    let msg = [
        123, 34, 116, 121, 112, 101, 34, 58, 34, 99, 114, 101, 97, 116, 101, 95, 115, 104, 121, 95,
        112, 111, 115, 116, 34, 44, 34, 116, 111, 112, 105, 99, 95, 105, 100, 34, 58, 34, 48, 120,
        100, 49, 101, 52, 49, 55, 52, 101, 50, 98, 97, 102, 57, 100, 48, 57, 48, 102, 49, 57, 34,
        44, 34, 112, 111, 115, 116, 95, 105, 100, 34, 58, 34, 48, 120, 49, 49, 52, 97, 55, 99, 49,
        49, 52, 55, 52, 102, 55, 55, 56, 101, 52, 53, 54, 56, 48, 52, 101, 100, 100, 57, 51, 51,
        48, 97, 101, 97, 50, 98, 54, 57, 54, 98, 98, 55, 50, 97, 52, 51, 48, 54, 49, 99, 50, 56,
        56, 52, 57, 56, 101, 98, 48, 49, 100, 55, 49, 56, 50, 100, 34, 44, 34, 99, 111, 110, 116,
        101, 110, 116, 34, 58, 34, 60, 112, 62, 227, 133, 136, 227, 133, 142, 227, 133, 129, 227,
        133, 136, 227, 132, 183, 60, 47, 112, 62, 34, 125,
    ];
    let vk_hex = "0x02f4068680af14b83162804307b55e45519133e3b23fcaed4e1013dc26c6473c78";
    let addr2 = verify_eth_sig(&sig_hex, &msg, &vk_hex).unwrap();
    println!("addr: {}", addr2);
}
