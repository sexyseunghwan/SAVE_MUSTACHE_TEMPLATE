/*
Author      : Seunghwan Shin 
Create date : 2025-08-00 
Description : 
    
History     : 2025-08-00 Seunghwan Shin       # [v.1.0.0] first create.
*/ 

mod common;
use common::common::*;

mod controller;

mod model;

mod repository;

mod service;

mod utils_modules;
use utils_modules::logger_utils::*;

mod traits;

#[tokio::main]
async fn main() {
    dotenv().ok();
    set_global_logger();
    info!("Start the template copy program");

    
    
    println!("Hello, world!");
}
