//! UI Views
//!
//! Contains all the different views/screens for the application.

mod server_list;
mod settings;
mod profiles;
mod logs;
mod about;

pub use server_list::build_server_list_view;
pub use settings::build_settings_view;
pub use profiles::build_profiles_view;
pub use logs::build_logs_view;
pub use about::build_about_view;
