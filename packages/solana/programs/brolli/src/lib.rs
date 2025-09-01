use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;
use mpl_token_metadata::types::{Creator, DataV2};

declare_id!("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM");

const MAX_SUPPLY: u64 = 50;
const MAX_LICENSES: usize = 50; // For Vec sizing

// Default URIs for new mints
const DEFAULT_IMAGE_URI: &str = "https://tan-everyday-mite-419.mypinata.cloud/ipfs/bafkreialme2ca3b36nzq5rqqdqaw3k2le4uvgrdxtdj33t2j4sn44amisi";
const DEFAULT_PROVENANCE_CID: &str = "https://tan-everyday-mite-419.mypinata.cloud/ipfs/bafkreidc7qbkdsfirbetsu5owm56oeqkhwhqlxpfgjio4qy3xexigod2nq";

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
        name: String,
        image_uri: String,
        provenance_cid: String,
    ) -> Result<()> {
        // Check supply limit and user eligibility first
        {
            let license_state = &ctx.accounts.license_state;
            require!(
                license_state.current_supply < license_state.max_supply,
                LicenseError::MaximumSupplyReached
            );

            require!(
                !license_state.has_license.contains(&ctx.accounts.user.key()),
                LicenseError::AlreadyHasLicense
            );
        }

        // Now update state (get mutable reference)
        let new_token_id = {
            let license_state = &mut ctx.accounts.license_state;
            license_state.has_license.push(ctx.accounts.user.key());
            license_state.current_supply += 1;
            license_state.current_supply
        };

        // Mint the NFT
        let license_state_seeds = &[
            b"license_state".as_ref(),
            &[ctx.bumps.license_state]
        ];
        let license_state_signer = &[&license_state_seeds[..]];

        token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.token_account.to_account_info(),
                    authority: ctx.accounts.license_state.to_account_info(),
                },
                license_state_signer,
            ),
            1, // Amount: 1 NFT
        )?;

        // Create NFT metadata using Metaplex
        let metadata_name = "Brolli".to_string();
        let metadata_symbol = "BROLLI".to_string();
        let metadata_uri = if image_uri.is_empty() {
            DEFAULT_IMAGE_URI.to_string()
        } else {
            image_uri.clone()
        };

        let creators = vec![Creator {
            address: ctx.accounts.license_state.key(),
            verified: true,
            share: 100,
        }];

        let metadata_data = DataV2 {
            name: metadata_name,
            symbol: metadata_symbol,
            uri: metadata_uri,
            seller_fee_basis_points: 0,
            creators: Some(creators),
            collection: None,
            uses: None,
        };

        // Create NFT metadata using Metaplex CPI
        mpl_token_metadata::instructions::CreateMetadataAccountV3CpiBuilder::new(
            &ctx.accounts.token_metadata_program,
        )
        .metadata(&ctx.accounts.metadata.to_account_info())
        .mint(&ctx.accounts.mint.to_account_info())
        .mint_authority(&ctx.accounts.license_state.to_account_info())
        .payer(&ctx.accounts.user.to_account_info())
        .update_authority(&ctx.accounts.license_state.to_account_info(), true)
        .system_program(&ctx.accounts.system_program.to_account_info())
        .rent(Some(&ctx.accounts.rent.to_account_info()))
        .data(metadata_data)
        .is_mutable(true)
        .invoke()?;

        // Store license metadata - use defaults if empty strings provided
        let license_metadata = &mut ctx.accounts.license_metadata;
        license_metadata.name = name.clone();
        license_metadata.image_uri = if image_uri.is_empty() {
            DEFAULT_IMAGE_URI.to_string()
        } else {
            image_uri
        };
        license_metadata.provenance_cid = if provenance_cid.is_empty() {
            DEFAULT_PROVENANCE_CID.to_string()
        } else {
            provenance_cid.clone()
        };
        license_metadata.owner = ctx.accounts.user.key();
        license_metadata.mint = ctx.accounts.mint.key();
        license_metadata.token_id = new_token_id;

        emit!(LicenseMinted {
            user: ctx.accounts.user.key(),
            mint: ctx.accounts.mint.key(),
            name,
            provenance_cid,
            token_id: new_token_id,
        });

        Ok(())
    }

    // Authority-only functions to update default URIs
    pub fn update_default_image_uri(ctx: Context<UpdateDefaults>, new_uri: String) -> Result<()> {
        let license_state = &ctx.accounts.license_state;
        require!(license_state.authority == ctx.accounts.authority.key(), LicenseError::Unauthorized);
        // In a real implementation, you would store default URIs in the license state
        // For now, we'll just emit an event
        emit!(DefaultUriUpdated {
            uri_type: "image".to_string(),
            new_uri,
        });
        Ok(())
    }

    pub fn update_default_provenance_cid(ctx: Context<UpdateDefaults>, new_cid: String) -> Result<()> {
        let license_state = &ctx.accounts.license_state;
        require!(license_state.authority == ctx.accounts.authority.key(), LicenseError::Unauthorized);
        // In a real implementation, you would store default URIs in the license state
        // For now, we'll just emit an event
        emit!(DefaultUriUpdated {
            uri_type: "provenance".to_string(),
            new_uri: new_cid,
        });
        Ok(())
    }

    // Get complete NFT metadata including provenance (similar to Solidity tokenURI)
    pub fn get_nft_metadata(ctx: Context<GetNftMetadata>) -> Result<NftMetadataResponse> {
        let license_metadata_account = &ctx.accounts.license_metadata;

        Ok(NftMetadataResponse {
            name: format!("Brolli {}", license_metadata_account.name),
            description: "For BUIDLers".to_string(),
            image: license_metadata_account.image_uri.clone(),
            provenance_cid: license_metadata_account.provenance_cid.clone(),
            token_id: license_metadata_account.token_id,
            owner: license_metadata_account.owner,
            mint: license_metadata_account.mint,
        })
    }

    // Get provenance trait information specifically
    pub fn get_provenance_trait(ctx: Context<GetNftMetadata>) -> Result<ProvenanceTrait> {
        let license_metadata_account = &ctx.accounts.license_metadata;

        Ok(ProvenanceTrait {
            trait_type: "Provenance CID".to_string(),
            value: license_metadata_account.provenance_cid.clone(),
        })
    }

    // Note: Supply info and license check are available by reading license_state account off-chain
    // No need for special instructions - just fetch the account data directly
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
        mint::authority = license_state,
        mint::freeze_authority = license_state,
        seeds = [b"mint", (license_state.current_supply + 1).to_le_bytes().as_ref()],
        bump
    )]
    pub mint: Account<'info, Mint>,

    /// CHECK: This account will be created by Metaplex
    #[account(
        mut,
        seeds = [b"metadata", mpl_token_metadata::ID.as_ref(), mint.key().as_ref()],
        bump,
        seeds::program = mpl_token_metadata::ID
    )]
    pub metadata: UncheckedAccount<'info>,

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
    /// CHECK: Validated by constraint
    pub token_metadata_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct GetNftMetadata<'info> {
    /// CHECK: Validated by mint address
    pub metadata: UncheckedAccount<'info>,

    pub license_metadata: Account<'info, LicenseMetadata>,
}

#[derive(Accounts)]
pub struct UpdateDefaults<'info> {
    #[account(
        mut,
        seeds = [b"license_state"],
        bump
    )]
    pub license_state: Account<'info, LicenseState>,

    #[account(mut)]
    pub authority: Signer<'info>,
}

// Removed GetSupplyInfo and HasLicense - read license_state account directly off-chain

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
    pub name: String,
    pub image_uri: String,
    pub provenance_cid: String,
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub token_id: u64,
}

impl LicenseMetadata {
    pub const SPACE: usize = 4 + 100 + 4 + 200 + 4 + 100 + 32 + 32 + 8; // String lengths + Pubkeys + u64
}

// Removed SupplyInfo struct - read license_state fields directly

#[event]
pub struct LicenseMinted {
    pub user: Pubkey,
    pub mint: Pubkey,
    pub name: String,
    pub provenance_cid: String,
    pub token_id: u64,
}

#[event]
pub struct DefaultUriUpdated {
    pub uri_type: String,
    pub new_uri: String,
}

#[error_code]
pub enum LicenseError {
    #[msg("Maximum supply reached")]
    MaximumSupplyReached,
    #[msg("Address already has Brolli")]
    AlreadyHasLicense,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid mint address")]
    InvalidMint,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct NftMetadataResponse {
    pub name: String,
    pub description: String,
    pub image: String,
    pub provenance_cid: String,
    pub token_id: u64,
    pub owner: Pubkey,
    pub mint: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ProvenanceTrait {
    pub trait_type: String,
    pub value: String,
}