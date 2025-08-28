use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM");

const MAX_SUPPLY: u64 = 50;
const MAX_LICENSES: usize = 50; // For Vec sizing

#[program]
pub mod brolli_license {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let license_state = &mut ctx.accounts.license_state;
        license_state.authority = ctx.accounts.authority.key();
        license_state.current_supply = 0;
        license_state.max_supply = MAX_SUPPLY;
        license_state.has_license = Vec::new();
        Ok(())
    }

    pub fn mint_license(
        ctx: Context<MintLicense>,
        patent_name: String,
        image_uri: String,
        provenance_cid: String,
    ) -> Result<()> {
        let license_state = &mut ctx.accounts.license_state;
        
        // Check supply limit
        require!(
            license_state.current_supply < license_state.max_supply,
            LicenseError::MaximumSupplyReached
        );

        // Check if user already has a license (one per wallet)
        require!(
            !license_state.has_license.contains(&ctx.accounts.user.key()),
            LicenseError::AlreadyHasLicense
        );

        // Add user to has_license list before minting (reentrancy protection)
        license_state.has_license.push(ctx.accounts.user.key());
        license_state.current_supply += 1;

        // Mint the NFT
        let supply_bytes = license_state.current_supply.to_le_bytes();
        let mint_seeds = &[
            b"mint".as_ref(),
            supply_bytes.as_ref(),
            &[ctx.bumps.mint]
        ];
        let mint_signer = &[&mint_seeds[..]];

        token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.token_account.to_account_info(),
                    authority: ctx.accounts.mint.to_account_info(),
                },
                mint_signer,
            ),
            1, // Amount: 1 NFT
        )?;

        // Store license metadata
        let license_metadata = &mut ctx.accounts.license_metadata;
        license_metadata.patent_name = patent_name.clone();
        license_metadata.image_uri = image_uri;
        license_metadata.provenance_cid = provenance_cid.clone();
        license_metadata.owner = ctx.accounts.user.key();
        license_metadata.mint = ctx.accounts.mint.key();
        license_metadata.token_id = license_state.current_supply;

        emit!(LicenseMinted {
            user: ctx.accounts.user.key(),
            mint: ctx.accounts.mint.key(),
            patent_name,
            provenance_cid,
            token_id: license_state.current_supply,
        });

        Ok(())
    }

    pub fn get_supply_info(ctx: Context<GetSupplyInfo>) -> Result<SupplyInfo> {
        let license_state = &ctx.accounts.license_state;
        Ok(SupplyInfo {
            current_supply: license_state.current_supply,
            max_supply: license_state.max_supply,
            remaining_supply: license_state.max_supply - license_state.current_supply,
        })
    }

    pub fn has_license(ctx: Context<HasLicense>, user: Pubkey) -> Result<bool> {
        let license_state = &ctx.accounts.license_state;
        Ok(license_state.has_license.contains(&user))
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + LicenseState::SPACE,
        seeds = [b"license_state"],
        bump
    )]
    pub license_state: Account<'info, LicenseState>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintLicense<'info> {
    #[account(
        mut,
        seeds = [b"license_state"],
        bump
    )]
    pub license_state: Account<'info, LicenseState>,

    #[account(
        init,
        payer = user,
        mint::decimals = 0,
        mint::authority = mint,
        mint::freeze_authority = mint,
        seeds = [b"mint", (license_state.current_supply + 1).to_le_bytes().as_ref()],
        bump
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init,
        payer = user,
        space = 8 + LicenseMetadata::SPACE,
        seeds = [b"metadata", mint.key().as_ref()],
        bump
    )]
    pub license_metadata: Account<'info, LicenseMetadata>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = mint,
        associated_token::authority = user
    )]
    pub token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct GetSupplyInfo<'info> {
    #[account(
        seeds = [b"license_state"],
        bump
    )]
    pub license_state: Account<'info, LicenseState>,
}

#[derive(Accounts)]
pub struct HasLicense<'info> {
    #[account(
        seeds = [b"license_state"],
        bump
    )]
    pub license_state: Account<'info, LicenseState>,
}

#[account]
pub struct LicenseState {
    pub authority: Pubkey,
    pub current_supply: u64,
    pub max_supply: u64,
    pub has_license: Vec<Pubkey>, // Track addresses that have licenses
}

impl LicenseState {
    pub const SPACE: usize = 32 + 8 + 8 + (4 + 32 * MAX_LICENSES); // authority + current_supply + max_supply + Vec<Pubkey>
}

#[account]
pub struct LicenseMetadata {
    pub patent_name: String,
    pub image_uri: String,
    pub provenance_cid: String,
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub token_id: u64,
}

impl LicenseMetadata {
    pub const SPACE: usize = 4 + 100 + 4 + 200 + 4 + 100 + 32 + 32 + 8; // String lengths + Pubkeys + u64
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct SupplyInfo {
    pub current_supply: u64,
    pub max_supply: u64,
    pub remaining_supply: u64,
}

#[event]
pub struct LicenseMinted {
    pub user: Pubkey,
    pub mint: Pubkey,
    pub patent_name: String,
    pub provenance_cid: String,
    pub token_id: u64,
}

#[error_code]
pub enum LicenseError {
    #[msg("Maximum supply of 50 licenses has been reached")]
    MaximumSupplyReached,
    #[msg("Address already has a license - only one per wallet allowed")]
    AlreadyHasLicense,
}