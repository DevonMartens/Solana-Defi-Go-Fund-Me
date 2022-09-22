use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod defi_go_fund_me {
    use std::error::Error;

    use super::*;
    /*
    function to create campagign
    @Dev: only owner of campagin can withdraw
    @Notice: In anchor context is always the first argument to get data from.
    @Notice: The context of the function in Solana is the list of accounts that that function needs to retrieve data from.
    @Params: 1. Name - string allows users to state campagin name 2. Desc - desc of campagn
    @Dev: specify return value as a result (returns fn results and errors) */
    pub fn create(ctx: Context<Create>, name: String, description: String) -> Result<()> {
        //create context list of accounts fn needs
        //the first is the campaign account
        let campaign = &mut ctx.accounts.campaign;
        //modify it hence mut
        campaign.name = name;
        campaign.description = description; 
        //amount $ raised (starts at 0)
        campaign.amount_raised = 0;
        //the user who created the campagin
        campaign.admin = *ctx.accounts.user.key;
        Ok(())

    }

}
/*
Macro explains that this is a context
*/
#[derive(Accounts)]
pub struct Create<'info>{
    /*
    @Dev: create a campaign account with this fn - why there is an init macro.
    @Notice: The last arg is an array.
    @Notice: Solona will use a hash function to determine the address for a new program derived account.
    @Notice: The `bump` ensures the hash isn't matching another acct by adding an 8bit bump until we find an unsed address
    */
    #[account(init, payer=user, space=9000, seeds=["b Campaign_demo".as_ref(), user.key().as_ref(), bump])]
    pub campaign: Account<'info, Campaign>,
    //speficies this as mutable so it can be changed
    #[account(mut)]
    pub user: Signer<'info>,
    //system specifications of blockchain
    //we dont use init here or with user b/c we dont create either
    pub system_program: Program<'info, System>
    /*
    must be a program derived acct b/c we use actual files in this program
    this account must send funds from itself to someone else
    for withdraw acct send $ from self to admin
    needs program permission - needs to be program derived
    */
}
//act macro
#[account]
/*
@Dev: This tracks 4 things. 
@Dev: Notice data structure defining what a Campaign should look like. 
* 1. Admin - user has the ability to withdraw funds from the campaign.
* 2. Name Then the name of our account.
* 3. Description - the description of our account.
* 4. And finally, the amount donated.
*/
pub struct Campaign {
    pub admin: Pubkey,
    pub name: String,
    pub description: String,
    pub amount_raised: i64
}


