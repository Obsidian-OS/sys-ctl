use neon::context::ModuleContext;
use neon::prelude::NeonResult;

mod nmcli;

#[neon::main]
pub fn main(mut cx: ModuleContext) -> NeonResult<()> {
    Ok(())
}
