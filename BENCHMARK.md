# CoreVPN Performance Benchmarks

Comprehensive performance benchmarks for CoreVPN's critical paths using [Criterion](https://github.com/bheisler/criterion.rs).

## Running Benchmarks

```bash
# Run all benchmarks
cargo bench

# Run crypto benchmarks only
cargo bench --bench crypto_benchmarks

# Run protocol benchmarks only
cargo bench --bench protocol_benchmarks

# Run specific benchmark group
cargo bench -- cipher_encrypt
cargo bench -- packet_parse

# Generate HTML reports (in target/criterion/)
cargo bench
```

---

## Benchmark Results

**System:** Results will vary based on CPU, compiler version, and system load.
**Profile:** Release build with LTO enabled.

### Cryptographic Operations

#### Symmetric Encryption (AEAD)

| Cipher | Payload Size | Throughput | Latency |
|--------|-------------|------------|---------|
| ChaCha20-Poly1305 | 64 B | ~600 MiB/s | ~95 ns |
| ChaCha20-Poly1305 | 512 B | ~1.2 GiB/s | ~360 ns |
| ChaCha20-Poly1305 | 1400 B | ~1.7 GiB/s | ~770 ns |
| ChaCha20-Poly1305 | 16 KB | ~1.8 GiB/s | ~8.5 µs |
| AES-256-GCM | 64 B | ~650 MiB/s | ~90 ns |
| AES-256-GCM | 512 B | ~1.5 GiB/s | ~310 ns |
| AES-256-GCM | 1400 B | ~1.8 GiB/s | ~720 ns |
| AES-256-GCM | 16 KB | ~2.2 GiB/s | ~6.8 µs |

> **Note:** AES-256-GCM benefits from AES-NI hardware acceleration on modern CPUs.

#### PacketCipher (with nonce management & replay protection)

| Cipher | Payload Size | Encrypt | Decrypt |
|--------|-------------|---------|---------|
| ChaCha20-Poly1305 | 512 B | ~1.2 GiB/s | ~1.5 GiB/s |
| ChaCha20-Poly1305 | 1400 B | ~1.6 GiB/s | ~1.9 GiB/s |
| AES-256-GCM | 512 B | ~1.4 GiB/s | ~1.5 GiB/s |
| AES-256-GCM | 1400 B | ~1.8 GiB/s | ~2.0 GiB/s |

#### Full VPN Pipeline (Encrypt/Decrypt + HMAC)

| Operation | Payload Size | Throughput | Latency |
|-----------|-------------|------------|---------|
| Encrypt + HMAC | 512 B | ~335 MiB/s | ~1.4 µs |
| Decrypt + Verify HMAC | 512 B | ~1.5 GiB/s | ~320 ns |
| Encrypt + HMAC | 1400 B | ~590 MiB/s | ~2.3 µs |
| Decrypt + Verify HMAC | 1400 B | ~2.0 GiB/s | ~650 ns |

#### Key Exchange & Signing

| Operation | Latency |
|-----------|---------|
| X25519 key generation | ~920 ns |
| X25519 Diffie-Hellman | ~27 µs |
| Ed25519 key generation | ~8.8 µs |
| Ed25519 sign (32 B message) | ~8.8 µs |
| Ed25519 verify | ~25 µs |

#### Key Derivation & HMAC

| Operation | Payload Size | Throughput | Latency |
|-----------|-------------|------------|---------|
| HKDF derive_keys | N/A | N/A | ~575 ns |
| HMAC-SHA256 authenticate | 64 B | ~370 MiB/s | ~165 ns |
| HMAC-SHA256 authenticate | 512 B | ~1.5 GiB/s | ~320 ns |
| HMAC-SHA256 authenticate | 1400 B | ~2.0 GiB/s | ~645 ns |

#### Random Number Generation

| Operation | Latency |
|-----------|---------|
| 8 bytes (session ID) | ~135 ns |
| 32 bytes (key material) | ~138 ns |
| 64 bytes | ~208 ns |

---

### Protocol Operations

#### Packet Parsing

| Packet Type | Throughput | Latency |
|-------------|------------|---------|
| Hard reset (control init) | N/A | ~15 ns |
| Control with ACKs | N/A | ~26 ns |
| Data V2 (1400 B payload) | ~30 GiB/s | ~33 ns |
| Control with tls-auth HMAC | ~58 GiB/s | ~22 ns |

#### Packet Serialization

| Packet Type | Throughput | Latency |
|-------------|------------|---------|
| Control (256 B payload) | N/A | ~34 ns |
| Data (1400 B payload) | ~36 GiB/s | ~36 ns |

#### Header Parsing

| Header Type | Latency |
|-------------|---------|
| Data (minimal) | ~5.2 ns |
| Control (no HMAC) | ~5.4 ns |
| Control (with tls-auth) | ~6.8 ns |

#### Reliable Transport

| Operation | Latency |
|-----------|---------|
| Create transport | ~10 ns |
| Send (queue packet) | ~29 ns |
| Process ACKs | ~16 ns |
| Receive packet | ~19 ns |

#### TLS Record Reassembly

| Operation | Latency |
|-----------|---------|
| Create reassembler | ~0.4 ns |
| Add fragment (64 B) | ~7.6 ns |
| Extract records | ~26 ns |

#### OpCode Operations

| Operation | Latency |
|-----------|---------|
| from_byte (parse) | ~6.3 ns |
| to_byte (serialize) | ~0.2 ns |
| is_data (check) | ~0.3 ns |

#### Bytes Buffer Operations

| Operation | Throughput | Latency |
|-----------|------------|---------|
| copy_from_slice (1400 B) | ~33 GiB/s | ~39 ns |
| BytesMut alloc+write (1400 B) | ~26 GiB/s | ~47 ns |
| BytesMut pre-alloc write (1400 B) | ~174 GiB/s | ~7.5 ns |

---

## Performance Optimizations

The following optimizations have been applied to achieve these results:

### Cryptographic Layer

1. **Counter-based Nonces** - `PacketCipher` uses monotonic counters instead of RNG syscalls
2. **Cipher Instance Caching** - Cipher instances are reused across packets
3. **Pre-allocated Buffers** - `encrypt_into()` method avoids allocations
4. **Static Error Strings** - Error types use `&'static str` instead of `String`

### Protocol Layer

1. **Zero-copy Parsing** - Uses `Bytes` for payload slicing without copying
2. **Inline Hot Paths** - `#[inline]` hints on parse/serialize functions
3. **Capacity Hints** - `BytesMut::with_capacity(1500)` for typical MTU
4. **Efficient Bit Operations** - Replay window uses optimized `u128` bitmap

### Compiler Optimizations

```toml
[profile.release]
lto = true           # Link-time optimization
codegen-units = 1    # Better optimization, slower compile
panic = "abort"      # Smaller binary, no unwinding
strip = true         # Strip symbols

[profile.bench]
lto = true
codegen-units = 1
```

---

## Capacity Planning

Based on benchmark results, estimated single-core capacity:

| Metric | Value | Notes |
|--------|-------|-------|
| Max encrypt throughput | ~1.8 GiB/s | AES-256-GCM, 1400 B packets |
| Max decrypt throughput | ~2.0 GiB/s | With HMAC verification |
| Packets per second (encrypt) | ~1.3M pps | 1400 B packets |
| Packets per second (parse) | ~30M pps | Data packets |
| New connections/sec | ~37K | Limited by X25519 DH |

For a 10 Gbps link with typical VPN overhead:
- Single core can handle ~15 Gbps of encryption throughput
- Packet parsing is not a bottleneck
- Key exchange (handshake) may require connection rate limiting

---

## Benchmark Files

| File | Description |
|------|-------------|
| `crates/corevpn-crypto/benches/crypto_benchmarks.rs` | Cipher, HMAC, KDF, signing, RNG |
| `crates/corevpn-protocol/benches/protocol_benchmarks.rs` | Packet parsing, serialization, transport |

---

## Comparing Results

To compare before/after optimization:

```bash
# Save baseline
cargo bench -- --save-baseline before

# Make changes, then compare
cargo bench -- --baseline before
```

Results are saved in `target/criterion/` with HTML reports.
