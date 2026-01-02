//! CoreVPN CLI
//!
//! Command-line interface for managing CoreVPN.

use std::path::PathBuf;

use anyhow::Result;
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "corevpn")]
#[command(about = "CoreVPN - Manage your VPN server and clients")]
#[command(version)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Initialize a new VPN server
    Init {
        /// Data directory
        #[arg(short, long, default_value = "/var/lib/corevpn")]
        data_dir: PathBuf,
    },

    /// Start the VPN server
    Start,

    /// Stop the VPN server
    Stop,

    /// Restart the VPN server
    Restart,

    /// Show server status
    Status,

    /// User management commands
    User {
        #[command(subcommand)]
        action: UserAction,
    },

    /// OAuth2 provider management
    OAuth {
        #[command(subcommand)]
        action: OAuthAction,
    },

    /// Run diagnostics
    Doctor,

    /// Generate client configuration
    Config {
        /// Username/email
        #[arg(short, long)]
        user: String,

        /// Output file
        #[arg(short, long)]
        output: Option<PathBuf>,
    },
}

#[derive(Subcommand)]
enum UserAction {
    /// Add a new user
    Add {
        /// Username or email
        username: String,
    },
    /// Remove a user
    Remove {
        /// Username or email
        username: String,
    },
    /// List all users
    List,
    /// Generate config for a user
    Config {
        /// Username or email
        username: String,
    },
    /// Revoke a user's access
    Revoke {
        /// Username or email
        username: String,
    },
}

#[derive(Subcommand)]
enum OAuthAction {
    /// Set up OAuth2 provider
    Setup {
        /// Provider type (google, microsoft, okta)
        provider: String,
    },
    /// Remove OAuth2 provider
    Remove {
        /// Provider type
        provider: String,
    },
    /// List configured providers
    List,
    /// Test OAuth2 connection
    Test {
        /// Provider type
        provider: String,
    },
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Commands::Init { data_dir } => {
            println!("Initializing CoreVPN in {:?}...", data_dir);
            println!();
            println!("Run 'corevpn-server setup' for the interactive setup wizard.");
        }
        Commands::Start => {
            println!("Starting CoreVPN server...");
            println!("Run 'corevpn-server run' to start the server.");
        }
        Commands::Stop => {
            println!("Stopping CoreVPN server...");
            // Would send signal to systemd or directly to process
        }
        Commands::Restart => {
            println!("Restarting CoreVPN server...");
        }
        Commands::Status => {
            println!("CoreVPN Status");
            println!("==============");
            println!("Run 'corevpn-server status' for detailed status.");
        }
        Commands::User { action } => match action {
            UserAction::Add { username } => {
                println!("Adding user: {}", username);
            }
            UserAction::Remove { username } => {
                println!("Removing user: {}", username);
            }
            UserAction::List => {
                println!("Listing users...");
            }
            UserAction::Config { username } => {
                println!("Generating config for: {}", username);
                println!("Run 'corevpn-server client -u {}' to generate.", username);
            }
            UserAction::Revoke { username } => {
                println!("Revoking access for: {}", username);
            }
        },
        Commands::OAuth { action } => match action {
            OAuthAction::Setup { provider } => {
                println!("Setting up OAuth2 provider: {}", provider);
                println!();
                println!("Run 'corevpn-server setup' and select OAuth2 configuration.");
            }
            OAuthAction::Remove { provider } => {
                println!("Removing OAuth2 provider: {}", provider);
            }
            OAuthAction::List => {
                println!("Configured OAuth2 providers:");
            }
            OAuthAction::Test { provider } => {
                println!("Testing OAuth2 provider: {}", provider);
            }
        },
        Commands::Doctor => {
            println!("Running diagnostics...");
            println!("Run 'corevpn-server doctor' for full diagnostics.");
        }
        Commands::Config { user, output } => {
            println!("Generating config for: {}", user);
            if let Some(out) = output {
                println!("Output: {:?}", out);
            }
        }
    }

    Ok(())
}
