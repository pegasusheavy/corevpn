{{/*
Expand the name of the chart.
*/}}
{{- define "corevpn.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "corevpn.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "corevpn.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "corevpn.labels" -}}
helm.sh/chart: {{ include "corevpn.chart" . }}
{{ include "corevpn.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "corevpn.selectorLabels" -}}
app.kubernetes.io/name: {{ include "corevpn.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Selector labels for server
*/}}
{{- define "corevpn.serverSelectorLabels" -}}
{{ include "corevpn.selectorLabels" . }}
app.kubernetes.io/component: server
{{- end }}

{{/*
Selector labels for web
*/}}
{{- define "corevpn.webSelectorLabels" -}}
{{ include "corevpn.selectorLabels" . }}
app.kubernetes.io/component: web
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "corevpn.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "corevpn.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the secret for admin credentials
*/}}
{{- define "corevpn.secretName" -}}
{{- if .Values.secrets.existingSecret }}
{{- .Values.secrets.existingSecret }}
{{- else }}
{{- include "corevpn.fullname" . }}-secrets
{{- end }}
{{- end }}

{{/*
Create the name of the PKI secret
*/}}
{{- define "corevpn.pkiSecretName" -}}
{{- if .Values.pki.existingSecret }}
{{- .Values.pki.existingSecret }}
{{- else }}
{{- include "corevpn.fullname" . }}-pki
{{- end }}
{{- end }}

{{/*
Generate config.toml content
*/}}
{{- define "corevpn.configToml" -}}
[server]
listen_addr = "0.0.0.0:{{ .Values.server.port }}"
{{- if .Values.server.tcpEnabled }}
tcp_listen_addr = "0.0.0.0:{{ .Values.server.tcpPort }}"
{{- end }}
public_host = {{ .Values.server.publicHost | quote }}
protocol = "udp"
max_clients = {{ .Values.server.maxClients }}
data_dir = "/var/lib/corevpn"

[network]
subnet = {{ .Values.server.subnet | quote }}
dns = {{ .Values.server.dns | toJson }}
redirect_gateway = {{ .Values.server.redirectGateway }}
mtu = {{ .Values.server.mtu }}

[security]
cipher = {{ .Values.security.cipher | quote }}
tls_min_version = {{ .Values.security.tlsMinVersion | quote }}
tls_auth = {{ .Values.security.tlsAuth }}
tls_crypt = {{ .Values.security.tlsCrypt }}
cert_lifetime_days = {{ .Values.security.certLifetimeDays }}
client_cert_lifetime_days = {{ .Values.security.clientCertLifetimeDays }}
reneg_sec = {{ .Values.security.renegSec }}
pfs = true

[logging]
level = {{ .Values.logging.level | quote }}
format = {{ .Values.logging.format | quote }}
connection_mode = {{ .Values.logging.connectionMode | quote }}

[logging.connection_events]
attempts = {{ .Values.logging.events.attempts }}
connects = {{ .Values.logging.events.connects }}
disconnects = {{ .Values.logging.events.disconnects }}
auth_events = {{ .Values.logging.events.authEvents }}
transfer_stats = {{ .Values.logging.events.transferStats }}
ip_changes = {{ .Values.logging.events.ipChanges }}
renegotiations = {{ .Values.logging.events.renegotiations }}

[logging.anonymization]
hash_client_ips = {{ .Values.logging.anonymization.hashClientIps }}
truncate_client_ips = {{ .Values.logging.anonymization.truncateClientIps }}
hash_usernames = {{ .Values.logging.anonymization.hashUsernames }}
round_timestamps = {{ .Values.logging.anonymization.roundTimestamps }}
aggregate_transfer_stats = {{ .Values.logging.anonymization.aggregateTransferStats }}

[logging.retention]
days = {{ .Values.logging.retention.days }}
auto_purge = {{ .Values.logging.retention.autoPurge }}
{{- if .Values.oauth.enabled }}

[oauth]
enabled = true
provider = {{ .Values.oauth.provider | quote }}
client_id = {{ .Values.oauth.clientId | quote }}
{{- if .Values.oauth.issuerUrl }}
issuer_url = {{ .Values.oauth.issuerUrl | quote }}
{{- end }}
{{- if .Values.oauth.tenantId }}
tenant_id = {{ .Values.oauth.tenantId | quote }}
{{- end }}
{{- if .Values.oauth.domain }}
domain = {{ .Values.oauth.domain | quote }}
{{- end }}
{{- if .Values.oauth.allowedDomains }}
allowed_domains = {{ .Values.oauth.allowedDomains | toJson }}
{{- end }}
{{- if .Values.oauth.requiredGroups }}
required_groups = {{ .Values.oauth.requiredGroups | toJson }}
{{- end }}
{{- end }}
{{- end }}
