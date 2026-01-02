# Contributing to CoreVPN

Thank you for your interest in contributing to CoreVPN! This document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Rust 1.70 or later
- Git
- (Optional) Docker for container testing
- (Optional) Helm for Kubernetes testing

### Development Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/corevpn.git
   cd corevpn
   ```

2. Install Rust (if not already installed):
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

3. Build the project:
   ```bash
   cargo build
   ```

4. Run tests:
   ```bash
   cargo test
   ```

## Development Workflow

### Branching

- `main` - Stable release branch
- `develop` - Development branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches
- `docs/*` - Documentation branches

### Making Changes

1. Create a branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Ensure code quality:
   ```bash
   # Format code
   cargo fmt

   # Run linter
   cargo clippy -- -D warnings

   # Run tests
   cargo test
   ```

4. Commit your changes:
   ```bash
   git commit -m "feat: add your feature description"
   ```

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add OAuth2 support for Google
fix: resolve connection timeout issue
docs: update README with ghost mode instructions
```

### Pull Requests

1. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a Pull Request on GitHub

3. Fill out the PR template

4. Wait for CI to pass

5. Address review feedback

## Code Style

### Rust Guidelines

- Follow the [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- Use `rustfmt` for formatting
- Address all `clippy` warnings
- Write documentation for public APIs

### Example:

```rust
/// Represents a VPN connection session.
///
/// # Example
///
/// ```rust,ignore
/// let session = Session::new(config)?;
/// session.connect().await?;
/// ```
pub struct Session {
    // ...
}
```

### Widget Implementation (for corevpn-ui)

Follow the OpenKit widget pattern:

```rust
pub struct MyWidget {
    base: WidgetBase,
    // widget-specific fields
}

impl MyWidget {
    pub fn new() -> Self {
        Self {
            base: WidgetBase::new().with_class("my-widget"),
        }
    }

    pub fn class(mut self, class: &str) -> Self {
        self.base.classes.add(class);
        self
    }
}

impl Widget for MyWidget {
    fn id(&self) -> WidgetId { self.base.id }
    fn type_name(&self) -> &'static str { "my-widget" }
    // ...
}
```

## Testing

### Running Tests

```bash
# All tests
cargo test

# Specific crate
cargo test -p corevpn-server

# With output
cargo test -- --nocapture
```

### Writing Tests

- Place unit tests in the same file as the code
- Place integration tests in `tests/` directory
- Use descriptive test names

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_connection_creates_session() {
        // Arrange
        let config = TestConfig::default();

        // Act
        let session = Session::new(config);

        // Assert
        assert!(session.is_ok());
    }
}
```

## Documentation

- Update documentation when changing functionality
- Add examples to doc comments
- Keep README.md up to date

## Security Considerations

When contributing:

- Never commit secrets or credentials
- Be careful with cryptographic code
- Consider privacy implications (especially for logging)
- Report security issues privately (see SECURITY.md)

## Getting Help

- Check existing [issues](https://github.com/PegasusHeavyIndustries/corevpn/issues)
- Start a [discussion](https://github.com/PegasusHeavyIndustries/corevpn/discussions)
- Read the [documentation](https://github.com/PegasusHeavyIndustries/corevpn/wiki)

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md
- Release notes
- Security advisories (for security researchers)

Thank you for contributing to CoreVPN! 🎉
