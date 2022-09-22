# Solana Go Fund Me dApp


This is a decentralized crowdfunding platform, like Go Fund Me or Kickstarter.

## Description 

```
Users will create crowdfunding campaigns for the cause of their choice. Raise money for charity, launch a new business, life for surgery, anything you want. The Solana program from scratch to handle the crowdfunding logic A program is a piece of code that runs in the floor on a blockchain in Solana. Programs can't store data on them.They create accounts which are like files on the blockchain, and those accounts can store data. Then a program retrieves the necessary information from accounts to be able to run.
```

## Derived Accounts & Contracts

```
Now we're going to build on the idea of the accounts and talk about program derived accounts. They are not limited to just sending money from one user to another. We can send money from a user to an account.

An example of an account that you might want to send money to is a crowdfunding account, which stores the funds that was sent to a crowdfunding campaign. The account is basically like a crowdfunding campaign. If we're sending money from one eye to an account, then again, person eye needs to give permission.

Now let's consider the scenario where we need the crowdfunding account to send money to wallet. For example, raising money for the Ukraine so we have created a crowdfunding account without that. In order to send funds someone needs to give permission. But the crowdfunding account doesn't technically have a user. If it's a wallet, then a wallet can have a user who can give permission. But with just an account, a regular account like a crowdfunding account, doesn't have a user who owns it.

So who gives permission? **This is where program derived accounts come into play.**. The crowdfunding account needs to be a program derived account. Then what happens is that whenever the crowdfunding account needs to send money, it gets permission from to sell on a program that controls it. Derived accounts are accounts that are able to send money.
```

## Front-End

```
The frontend is in JavaScript with the React library and Node is the backend. The contract is obviously in Rust.
```

# Contract Deploy Instruction

1. Generate new wallet to deploy 

  ``` 
  solana-keygen new -o id.json
  ```
* No passphrase needed `hit enter`.

pubkey: 9wtuC5xKhf9QnCuwWrAfsE71t5eDKr5EgHaqmGjdqXQY
==========================================================================


2. Copy the public key and airdrop SOL into wallet. 

  ```
  solana airdrop 4 9wtuC5xKhf9QnCuwWrAfsE71t5eDKr5EgHaqmGjdqXQY --url devnet
  ```

  ```
  solana airdrop 4 publicKey --url devnet
  ```

3. Run `anchor build` which will generate a `program id`.

  ```
  anchor build
  ```

4. To get the `program id` you generated run:

  ```
  solana address -k ./target/deploy/Defi-Go-Fund-Me-keypair.json
  ```

  ```
  solana address -k ./target/deploy/YOUR_PROJECT_NAME-keypair.json
  ```
If you get this error:

  ```
  Error: No default signer found, run "solana-keygen new -o ./target/deploy/Defi-Go-Fund-Me-keypair.json" to create a new one
  ```

  Run:

  ```
  solana-keygen new -o ./target/deploy/Defi-Go-Fund-Me-keypair.json
  ```
Then retry:

  ```
  solana address -k ./target/deploy/Defi-Go-Fund-Me-keypair.json   
  ```

5. Copy the program ID and past in the anchor.tml file. For example:

  ```
  defi_go_fund_me = "4ihLbA5Q6je6Mf3QGAMDKMPsixZpmZHVjQupda2w9QZ5"

  OR

  YOUR_APP_NAME = "programID"
  ```
AND in lib.rs

  ```
  declare_id!("4ihLbA5Q6je6Mf3QGAMDKMPsixZpmZHVjQupda2w9QZ5");

  OR

  declare_id!("programID"0
  ```
6. Run `anchor build` in root in the terminal.  

7. Then run `anchor deploy`. Feedback will look like:

  ```
  Deploying workspace: https://api.devnet.solana.com
  Upgrade authority: id.json
  Deploying program "Defi-Go-Fund-Me"...
  Program path: /Users/devonmartens/contracts/solana/Defi-Go-Fund-Me/target/deploy/defi_go_fund_me.so...
  Program Id: 2rRtqZMmkqtHgTuXjvPRigmhjr9jfNnuWTMNMJ7NeyTN

  Deploy success
  ```
  
Devnet link:
  https://explorer.solana.com/address/2rRtqZMmkqtHgTuXjvPRigmhjr9jfNnuWTMNMJ7NeyTN?cluster=devnet