#!/bin/bash
# CoreVPN crates.io publishing script
#
# Publishes crates in dependency order:
# 1. corevpn-crypto (no internal deps)
# 2. corevpn-core (depends on crypto)
# 3. corevpn-protocol (depends on crypto, core)
# 4. corevpn-auth (depends on crypto, core)
# 5. corevpn-config (depends on crypto, core)
# 6. corevpn-server (depends on all above)
# 7. corevpn-cli (depends on crypto, core, config, auth)
#
# Note: corevpn-ui is NOT published (depends on unpublished openkit)

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're doing a dry run
DRY_RUN=""
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN="--dry-run"
    echo -e "${YELLOW}Running in dry-run mode${NC}"
fi

# Check if logged in to crates.io
if [[ -z "$DRY_RUN" ]]; then
    echo "Checking crates.io authentication..."
    if ! cargo login --help > /dev/null 2>&1; then
        echo -e "${RED}Please run 'cargo login' first${NC}"
        exit 1
    fi
fi

# Get workspace version from root Cargo.toml
get_workspace_version() {
    grep -A5 '\[workspace\.package\]' Cargo.toml | grep '^version' | head -1 | sed 's/.*"\(.*\)".*/\1/'
}

# Function to get crate version from Cargo.toml
get_crate_version() {
    local crate=$1
    local toml_path="crates/${crate}/Cargo.toml"
    
    if [[ -f "$toml_path" ]]; then
        # Check if using workspace version
        if grep -q 'version\.workspace\s*=\s*true' "$toml_path" || grep -q 'version.workspace = true' "$toml_path"; then
            get_workspace_version
        else
            # Get version directly from crate's Cargo.toml
            grep '^version\s*=' "$toml_path" | head -1 | sed 's/.*"\(.*\)".*/\1/'
        fi
    else
        echo ""
    fi
}

# Function to check if a crate version is already published
is_published() {
    local crate=$1
    local version=$2
    
    # Query crates.io API
    local response=$(curl -s "https://crates.io/api/v1/crates/${crate}/${version}" 2>/dev/null)
    
    # Check if version exists (response contains "version" field, not "errors")
    if echo "$response" | grep -q '"version"' && ! echo "$response" | grep -q '"errors"'; then
        return 0  # Already published
    else
        return 1  # Not published
    fi
}

# Crates to publish in order
CRATES=(
    "corevpn-crypto"
    "corevpn-core"
    "corevpn-protocol"
    "corevpn-auth"
    "corevpn-config"
    "corevpn-server"
    "corevpn-cli"
)

echo "Publishing CoreVPN crates to crates.io..."
echo ""

PUBLISHED=()
SKIPPED=()

for crate in "${CRATES[@]}"; do
    version=$(get_crate_version "$crate")
    
    if [[ -z "$version" ]]; then
        echo -e "${RED}✗ Could not determine version for ${crate}${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}Checking ${crate} v${version}...${NC}"
    
    # Check if already published (skip check in dry-run mode)
    if [[ -z "$DRY_RUN" ]] && is_published "$crate" "$version"; then
        echo -e "${BLUE}⊘ ${crate} v${version} already published, skipping${NC}"
        SKIPPED+=("$crate")
        echo ""
        continue
    fi
    
    echo -e "${YELLOW}Publishing ${crate} v${version}...${NC}"
    
    if cargo publish -p "$crate" $DRY_RUN; then
        echo -e "${GREEN}✓ ${crate} v${version} published successfully${NC}"
        PUBLISHED+=("$crate")
    else
        echo -e "${RED}✗ Failed to publish ${crate}${NC}"
        exit 1
    fi

    # Wait between publishes to let crates.io index
    if [[ -z "$DRY_RUN" ]]; then
        echo "Waiting for crates.io to index..."
        sleep 30
    fi

    echo ""
done

echo -e "${GREEN}Publishing complete!${NC}"
echo ""

if [[ ${#PUBLISHED[@]} -gt 0 ]]; then
    echo "Published crates:"
    for crate in "${PUBLISHED[@]}"; do
        echo -e "  ${GREEN}✓${NC} https://crates.io/crates/${crate}"
    done
fi

if [[ ${#SKIPPED[@]} -gt 0 ]]; then
    echo ""
    echo "Skipped (already published):"
    for crate in "${SKIPPED[@]}"; do
        echo -e "  ${BLUE}⊘${NC} https://crates.io/crates/${crate}"
    done
fi
