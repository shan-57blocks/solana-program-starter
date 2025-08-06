use anchor_lang::prelude::*;

declare_id!("ESCRythK359iqXTANRrZ1h6VnVuk2R713ioAuweXGvaB");

#[program]
pub mod review {
    use super::*;
    pub fn post_review(
        ctx: Context<ReviewAccounts>,
        restaurant: String,
        review: String,
        rating: u8,
    ) -> Result<()> {
        let new_review = &mut ctx.accounts.review;
        new_review.reviewer = ctx.accounts.signer.key();
        new_review.restaurant = restaurant;
        new_review.review = review;
        new_review.rating = rating;

        emit!(PostReviewEvent {
            restaurant: new_review.restaurant.to_string(),
            review: new_review.review.to_string(),
            rating: new_review.rating,
            reviewer: ctx.accounts.signer.key()
        });
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(restaurant: String)]
pub struct ReviewAccounts<'info> {
    #[account(
        init_if_needed,
        payer = signer,
        space = 500,
        seeds = [restaurant.as_bytes().as_ref(), signer.key().as_ref()],
        bump
    )]
    pub review: Account<'info, Review>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Review {
    pub reviewer: Pubkey,
    pub restaurant: String,
    pub review: String,
    pub rating: u8,
}

#[event]
pub struct PostReviewEvent {
    pub restaurant: String,
    pub review: String,
    pub rating: u8,
    pub reviewer: Pubkey,
}
