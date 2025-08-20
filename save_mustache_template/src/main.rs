/*
Author      : Seunghwan Shin
Create date : 2025-08-20
Description : Elasticsearch Mustache template 을 관리해주기 위한 프로그램

History     : 2025-08-20 Seunghwan Shin       # [v.1.0.0] first create.
*/

mod common;
use common::common::*;

mod controller;
use controller::main_controller::*;

mod model;

mod repository;
use repository::es_repository_impl::*;

mod service;
use service::template_service_impl::*;

mod utils_modules;
use utils_modules::logger_utils::*;

mod traits;

mod enums;

#[tokio::main]
async fn main() {
    dotenv().ok();
    set_global_logger();
    info!("Start the template copy program");

    /* 의존성 주입 */
    let es_conn: EsRepositoryImpl = EsRepositoryImpl::new();
    let template_service: TemplateServiceImpl<EsRepositoryImpl> = TemplateServiceImpl::new(es_conn);
    let main_controller: MainController<TemplateServiceImpl<EsRepositoryImpl>> = MainController::new(template_service);
    
    /* 메인함수 실행 */
    match main_controller.main_task().await {
        Ok(_) => {
            info!("All task have been successful.");
        }, 
        Err(e) => {
            error!("[ERROR][main] {:?}", e);
            panic!("[ERROR][main] {:?}", e);
        }
    }
}
