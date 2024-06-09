use dbus::blocking::Connection;
use neon::context::Context;
use neon::context::FunctionContext;
use neon::types::Finalize;
use neon::types::JsBox;
use neon::result::JsResult;
use networkmanager::NetworkManager;

pub struct NetMan {
    dbus: Connection,
}

impl NetMan {
    pub fn new(mut cx: FunctionContext) -> JsResult<JsBox<Self>> {
        let Ok(dbus) = Connection::new_system() else { cx.throw_error("Failed to initialise DBus connection")? };
        
        
        Ok(cx.boxed(Self {
            dbus
        }))
    }
    
    fn nm(&self) -> NetworkManager {
        NetworkManager::new(&self.dbus)
    }
}

impl Finalize for NetMan {
    fn finalize<'a, C: Context<'a>>(self, cx: &mut C) {}    
}

#[cfg(test)]
mod test {
    use std::collections::HashMap;

    use dbus::{blocking::Connection};
    use networkmanager::{NetworkManager, devices::{Device, Wireless}, Error};

    #[test]
    pub fn get_list_wifi() -> Result<(), Error> {
        let dbus = Connection::new_system()
            .expect("Unable to get DBus connection");
        
        let nm = NetworkManager::new(&dbus);
        
        for dev in nm.get_devices()? {
            match dev {
                Device::WiFi(wifi) => {
                    wifi.request_scan(HashMap::new())?;
                    
                    for ap in wifi.get_all_access_points()? {
                        print!("Access Point Found: {}", ap.ssid().unwrap_or("<Hidden Network>".to_owned()));
                    }
                },
                _ => {}
            }
        }
        
        Ok(())
    }
}