use anyhow::{Result};
use rust_decimal::Decimal;
use rust_decimal::prelude::ToPrimitive;

pub fn decimal_to_atomic_str(amount_str: &str, scale: u8) -> Result<i64> {
    let dec = amount_str.parse::<Decimal>()?;
    decimal_to_atomic(dec, scale)
}

pub fn decimal_to_atomic(dec: Decimal, scale: u8) -> Result<i64> {
    let factor = Decimal::from(10u64.pow(scale as u32));
    let v = (dec * factor).round();
    let i = v
        .to_i64()
        .ok_or_else(|| anyhow::anyhow!("qty out of range"))?;
    Ok(i)
}
