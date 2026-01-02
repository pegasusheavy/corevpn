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

for crate in "${CRATES[@]}"; do
    echo -e "${YELLOW}Publishing ${crate}...${NC}"
    
    if cargo publish -p "$crate" $DRY_RUN; then
        echo -e "${GREEN}✓ ${crate} published successfully${NC}"
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

echo -e "${GREEN}All crates published successfully!${NC}"
echo ""
echo "Published crates:"
for crate in "${CRATES[@]}"; do
    echo "  - https://crates.io/crates/${crate}"
done
