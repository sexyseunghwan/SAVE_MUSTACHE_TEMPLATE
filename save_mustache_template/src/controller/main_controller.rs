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
            self.clear_screen();
            self.show_menu();
            let choice: String = self.get_user_input("Please select a number")?;
            
            match choice.trim() {
                "1" => {
                    self.update_all_templates().await?;
                }
                "2" => {
                    self.update_speicific_template().await?;
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

    #[doc = "1. Update all templates from server"]
    async fn update_all_templates(&self) -> anyhow::Result<()> {

        self.clear_screen();
        println!("Getting template list...");

        match self.template_service.sync_all_template_from_server().await {
            Ok(_) => {
                println!("Successfully loaded the list of templates.");
            },
            Err(e) => {
                println!("Failed to load template list.");
                error!("[ERROR][main_task] {:?}", e);
                
            }
        }

        self.get_user_input("Press any key to continue")?;

        Ok(())
    }

    #[doc = "2. Update a specific template from server"]
    async fn update_speicific_template(&self) -> anyhow::Result<()> {

        self.clear_screen();
        let choice: String = self.get_user_input("Please enter the template name")?;
        let trimmed_choice: String = choice.trim().to_string();

        self.template_service.sync_specific_template_from_server(&trimmed_choice).await?;

        self.get_user_input("Press any key to continue")?;

        Ok(())
    }

    
    fn show_menu(&self) {
        println!("\n=== Mustache Template Manager ===");
        println!("1. Update all templates from server");
        println!("2. Update a specific template from server");
        println!("q. Quit");
        println!("================================");
    }

    fn clear_screen(&self) {

        for _i in 0..100 {
            println!();
        }
    }
    
    fn get_user_input(&self, prompt: &str) -> anyhow::Result<String> {
        print!("{}: ", prompt);
        io::stdout().flush()?;
        
        let mut input = String::new();
        io::stdin().read_line(&mut input)?;
        
        Ok(input)
    }
}