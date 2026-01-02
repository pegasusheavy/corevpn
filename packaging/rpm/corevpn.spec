%global _hardened_build 1

Name:           corevpn
Version:        0.1.0
Release:        1%{?dist}
Summary:        Secure OpenVPN-compatible VPN server with OAuth2 support

License:        MIT OR Apache-2.0
URL:            https://github.com/PegasusHeavyIndustries/corevpn
Source0:        %{name}-%{version}.tar.gz

BuildRequires:  cargo >= 1.70
BuildRequires:  rust >= 1.70
BuildRequires:  openssl-devel
BuildRequires:  systemd-rpm-macros

Requires:       openssl
Requires(pre):  shadow-utils

%description
CoreVPN is a modern, secure VPN server that provides:
- Full OpenVPN protocol compatibility
- OAuth2/OIDC/SAML authentication support
- TLS 1.3 with modern cipher suites
- Flexible connection logging with ghost mode
- Web-based administration interface

%package server
Summary:        CoreVPN Server
Requires:       %{name}-common = %{version}-%{release}
Requires(post): systemd
Requires(preun): systemd
Requires(postun): systemd

%description server
The CoreVPN server component providing VPN connectivity and
web-based administration.

%package cli
Summary:        CoreVPN Command-line Client
Requires:       %{name}-common = %{version}-%{release}

%description cli
Command-line client for connecting to CoreVPN and OpenVPN servers.

%package common
Summary:        Common files for CoreVPN

%description common
Common configuration and documentation files for CoreVPN.

%prep
%autosetup -n %{name}-%{version}

%build
cargo build --release --locked

%install
# Create directories
install -d %{buildroot}%{_bindir}
install -d %{buildroot}%{_unitdir}
install -d %{buildroot}%{_sysconfdir}/corevpn
install -d %{buildroot}%{_sharedstatedir}/corevpn
install -d %{buildroot}%{_localstatedir}/log/corevpn
install -d %{buildroot}%{_rundir}/corevpn
install -d %{buildroot}%{_docdir}/%{name}

# Install binaries
install -m 0755 target/release/corevpn-server %{buildroot}%{_bindir}/
install -m 0755 target/release/corevpn-cli %{buildroot}%{_bindir}/

# Install systemd units
install -m 0644 packaging/systemd/corevpn-server.service %{buildroot}%{_unitdir}/
install -m 0644 packaging/systemd/corevpn-server@.service %{buildroot}%{_unitdir}/
install -m 0644 packaging/systemd/corevpn-web.service %{buildroot}%{_unitdir}/

# Install configuration
install -m 0644 packaging/config/config.toml.example %{buildroot}%{_sysconfdir}/corevpn/
install -m 0640 packaging/config/environment.example %{buildroot}%{_sysconfdir}/corevpn/

# Install documentation
install -m 0644 packaging/config/README.rpm %{buildroot}%{_docdir}/%{name}/

%pre server
# Create user and group
getent group corevpn >/dev/null || groupadd -r corevpn
getent passwd corevpn >/dev/null || \
    useradd -r -g corevpn -d %{_sharedstatedir}/corevpn -s /sbin/nologin \
    -c "CoreVPN Server" corevpn
exit 0

%post server
%systemd_post corevpn-server.service corevpn-web.service

# Set up directories
install -d -m 0750 -o corevpn -g corevpn %{_sharedstatedir}/corevpn
install -d -m 0750 -o corevpn -g corevpn %{_localstatedir}/log/corevpn
chown root:corevpn %{_sysconfdir}/corevpn
chmod 0750 %{_sysconfdir}/corevpn

# Create default config if missing
if [ ! -f %{_sysconfdir}/corevpn/config.toml ]; then
    cp %{_sysconfdir}/corevpn/config.toml.example %{_sysconfdir}/corevpn/config.toml
    chmod 0640 %{_sysconfdir}/corevpn/config.toml
    chown root:corevpn %{_sysconfdir}/corevpn/config.toml
fi

# Create environment file if missing
if [ ! -f %{_sysconfdir}/corevpn/environment ]; then
    cp %{_sysconfdir}/corevpn/environment.example %{_sysconfdir}/corevpn/environment
    chmod 0600 %{_sysconfdir}/corevpn/environment
fi

# Load TUN module
modprobe tun 2>/dev/null || :

echo ""
echo "CoreVPN Server installed successfully!"
echo ""
echo "Quick start:"
echo "  1. Edit %{_sysconfdir}/corevpn/config.toml"
echo "  2. Run: sudo corevpn-server setup --data-dir %{_sharedstatedir}/corevpn"
echo "  3. Set admin password in %{_sysconfdir}/corevpn/environment"
echo "  4. Enable and start: sudo systemctl enable --now corevpn-server"
echo ""

%preun server
%systemd_preun corevpn-server.service corevpn-web.service

%postun server
%systemd_postun_with_restart corevpn-server.service corevpn-web.service

%files server
%{_bindir}/corevpn-server
%{_unitdir}/corevpn-server.service
%{_unitdir}/corevpn-server@.service
%{_unitdir}/corevpn-web.service
%dir %attr(0750,root,corevpn) %{_sysconfdir}/corevpn
%config(noreplace) %attr(0644,root,corevpn) %{_sysconfdir}/corevpn/config.toml.example
%config(noreplace) %attr(0600,root,root) %{_sysconfdir}/corevpn/environment.example
%dir %attr(0750,corevpn,corevpn) %{_sharedstatedir}/corevpn
%dir %attr(0750,corevpn,corevpn) %{_localstatedir}/log/corevpn

%files cli
%{_bindir}/corevpn-cli

%files common
%license LICENSE-MIT LICENSE-APACHE
%doc %{_docdir}/%{name}/

%changelog
* Fri Jan 02 2026 Pegasus Heavy Industries <support@pegasusheavyindustries.com> - 0.1.0-1
- Initial release
- OpenVPN-compatible protocol support
- OAuth2/OIDC/SAML authentication
- TLS 1.3 with modern cipher suites
- Ghost mode for zero-logging operation
- Web-based administration interface
- Systemd service integration
