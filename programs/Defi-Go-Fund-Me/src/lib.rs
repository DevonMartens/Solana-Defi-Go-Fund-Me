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
        campaign.admin = ctx.accounts.user;
        Ok(())

    }

}
/*
Macro explains that this is a context
*/
#[derive(Accounts)]
pub struct Create<'info>{
    //create a campaign account with this fn - why there is an init macro
    #[account(init, payer=user, space=9000)]
    pub campaign: Account<'info, Campaign>,
    //speficies this as mutable so it can be changed
    #[account(mut)]
    pub user: Signer<'info>,
    //system specifications of blockchain
    //we dont use init here or with user b/c we dont create either
    pub system_program: Program<'info, System>
}


