use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod defi_go_fund_me {
    use std::error::Error;

    use super::*;
    /*
    function to create campagign
    @Dev: only owner of campagin can withdraw
    @Notice: in anchor context is always the first argument to get data from
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


