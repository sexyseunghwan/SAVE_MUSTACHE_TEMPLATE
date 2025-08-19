use crate::common::common::*;
use crate::traits::service::template_service::*;
use std::io::{self, Write};

#[derive(Debug, new)]
pub struct MainController<T: TemplateService> {
    template_service: T,
}

impl<T: TemplateService> MainController<T> {
    #[doc = "메인 테스크"]
    pub async fn main_task(&self) -> anyhow::Result<()> {
        
        /* 1. 클러스터에 있는 모든 mustache template 을 가져와준다. */
        
        loop {
            self.show_menu();
            let choice: String = self.get_user_input("Please select a number")?;
            
            match choice.trim() {
                "1" => {
                    self.template_service.sync_all_template_from_server().await?;
                    //println!("템플릿 목록을 가져오는 중...");
                    // TODO: 템플릿 목록 가져오기 구현
                }
                "2" => {
                    //let template_name = self.get_user_input("템플릿 이름을 입력하세요")?;
                    //println!("템플릿 '{}' 저장 중...", template_name.trim());
                    // TODO: 템플릿 저장 구현
                }
                "3" => {
                    //let template_id = self.get_user_input("템플릿 ID를 입력하세요")?;
                    //println!("템플릿 ID '{}' 삭제 중...", template_id.trim());
                    // TODO: 템플릿 삭제 구현
                }
                "q" | "Q" => {
                    println!("Exit the program.");
                    break;
                }
                _ => {
                    println!("Invalid choice, please try again.");
                }
            }
        }
        
        Ok(())
    }
    
    fn show_menu(&self) {
        println!("\n=== Mustache Template Manager ===");
        println!("1. Update all templates from server");
        println!("2. Update a specific template from server");
        //println!("3. 템플릿 삭제하기");
        println!("q. Quit");
        println!("================================");
    }
    
    fn get_user_input(&self, prompt: &str) -> anyhow::Result<String> {
        print!("{}: ", prompt);
        io::stdout().flush()?;
        
        let mut input = String::new();
        io::stdin().read_line(&mut input)?;
        
        Ok(input)
    }
}