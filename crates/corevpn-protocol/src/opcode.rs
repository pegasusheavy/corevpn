//! OpenVPN Protocol Opcodes
//!
//! Defines the packet types used in the OpenVPN protocol.

use crate::{ProtocolError, Result};

/// OpenVPN packet opcode (high 5 bits of first byte)
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
pub enum OpCode {
    /// Control channel packet with reliability layer (P_CONTROL_V1)
    ControlV1 = 4,

    /// Acknowledgment packet (P_ACK_V1)
    AckV1 = 5,

    /// Data channel packet with current key (P_DATA_V1)
    DataV1 = 6,

    /// Hard reset from client v2 (P_CONTROL_HARD_RESET_CLIENT_V2)
    HardResetClientV2 = 7,

    /// Hard reset from server v2 (P_CONTROL_HARD_RESET_SERVER_V2)
    HardResetServerV2 = 8,

    /// Soft reset v1 (P_CONTROL_SOFT_RESET_V1)
    SoftResetV1 = 3,

    /// Data channel v2 with peer-id (P_DATA_V2)
    DataV2 = 9,

    /// Hard reset from client v3 (P_CONTROL_HARD_RESET_CLIENT_V3) - with tls-crypt-v2
    HardResetClientV3 = 10,

    /// Control channel with tls-crypt (P_CONTROL_WKC_V1)
    ControlWkcV1 = 11,
}

impl OpCode {
    /// Parse opcode from raw byte (high 5 bits)
    pub fn from_byte(byte: u8) -> Result<Self> {
        let opcode = byte >> 3;
        match opcode {
            3 => Ok(OpCode::SoftResetV1),
            4 => Ok(OpCode::ControlV1),
            5 => Ok(OpCode::AckV1),
            6 => Ok(OpCode::DataV1),
            7 => Ok(OpCode::HardResetClientV2),
            8 => Ok(OpCode::HardResetServerV2),
            9 => Ok(OpCode::DataV2),
            10 => Ok(OpCode::HardResetClientV3),
            11 => Ok(OpCode::ControlWkcV1),
            _ => Err(ProtocolError::UnknownOpcode(opcode)),
        }
    }

    /// Convert opcode to byte (shifted to high 5 bits)
    pub fn to_byte(self, key_id: KeyId) -> u8 {
        ((self as u8) << 3) | (key_id.0 & 0x07)
    }

    /// Check if this is a control channel opcode
    pub fn is_control(&self) -> bool {
        matches!(
            self,
            OpCode::ControlV1
                | OpCode::AckV1
                | OpCode::HardResetClientV2
                | OpCode::HardResetServerV2
                | OpCode::SoftResetV1
                | OpCode::HardResetClientV3
                | OpCode::ControlWkcV1
        )
    }

    /// Check if this is a data channel opcode
    pub fn is_data(&self) -> bool {
        matches!(self, OpCode::DataV1 | OpCode::DataV2)
    }

    /// Check if this is a hard reset opcode
    pub fn is_hard_reset(&self) -> bool {
        matches!(
            self,
            OpCode::HardResetClientV2 | OpCode::HardResetServerV2 | OpCode::HardResetClientV3
        )
    }
}

impl std::fmt::Display for OpCode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            OpCode::ControlV1 => write!(f, "P_CONTROL_V1"),
            OpCode::AckV1 => write!(f, "P_ACK_V1"),
            OpCode::DataV1 => write!(f, "P_DATA_V1"),
            OpCode::HardResetClientV2 => write!(f, "P_CONTROL_HARD_RESET_CLIENT_V2"),
            OpCode::HardResetServerV2 => write!(f, "P_CONTROL_HARD_RESET_SERVER_V2"),
            OpCode::SoftResetV1 => write!(f, "P_CONTROL_SOFT_RESET_V1"),
            OpCode::DataV2 => write!(f, "P_DATA_V2"),
            OpCode::HardResetClientV3 => write!(f, "P_CONTROL_HARD_RESET_CLIENT_V3"),
            OpCode::ControlWkcV1 => write!(f, "P_CONTROL_WKC_V1"),
        }
    }
}

/// Key ID (low 3 bits of first byte)
///
/// Used to identify which key to use for data channel encryption.
/// Allows key renegotiation without interrupting traffic.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct KeyId(pub u8);

impl KeyId {
    /// Create a new key ID
    pub fn new(id: u8) -> Self {
        Self(id & 0x07)
    }

    /// Parse key ID from raw byte (low 3 bits)
    pub fn from_byte(byte: u8) -> Self {
        Self(byte & 0x07)
    }

    /// Get the next key ID (wraps around)
    pub fn next(&self) -> Self {
        Self((self.0 + 1) & 0x07)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_opcode_roundtrip() {
        let key_id = KeyId::new(3);

        for opcode in [
            OpCode::ControlV1,
            OpCode::AckV1,
            OpCode::DataV1,
            OpCode::HardResetClientV2,
            OpCode::HardResetServerV2,
            OpCode::DataV2,
        ] {
            let byte = opcode.to_byte(key_id);
            let parsed = OpCode::from_byte(byte).unwrap();
            let parsed_key_id = KeyId::from_byte(byte);

            assert_eq!(opcode, parsed);
            assert_eq!(key_id, parsed_key_id);
        }
    }

    #[test]
    fn test_key_id_wrap() {
        let key_id = KeyId::new(7);
        assert_eq!(key_id.next(), KeyId::new(0));
    }
}
