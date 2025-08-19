use crate::common::common::*;


use crate::model::{
    mustache_template::*, script_content::*
};

use crate::traits::service::template_service::*;
use crate::traits::repository::es_repository::*;

#[derive(Debug, Getters, Clone, new)]
#[getset(get = "pub")]
pub struct TemplateServiceImpl<R: EsRepository> {
    es_repository: R,
}

impl<R: EsRepository> TemplateServiceImpl<R> {

    #[doc = "서버에 존재하는 모든 mustache template정보를 가져와주는 함수"]
    async fn find_all_mustache_template(&self) -> anyhow::Result<Vec<MustacheTemplate>> {

        /* 현재 존재하는 mustache template 정보들 */
        let source_template_infos: Value = self.es_repository.get_mustache_template_infos().await?;

        /* 각 mustache template 의 이름을 가져와주는 함수 */
        let template_name_list: Vec<String> = source_template_infos
            .get("metadata")
            .ok_or_else(|| anyhow!("[ERROR][TemplateServiceImpl->find_all_mustache_template] The `metadata` field is missing."))?
            .get("stored_scripts")
            .ok_or_else(|| anyhow!("[ERROR][TemplateServiceImpl->find_all_mustache_template] The `stored_scripts` field is missing."))?
            .as_object()
            .ok_or_else(|| anyhow::anyhow!("[ERROR][TemplateServiceImpl->find_all_mustache_template] stored_scripts is not an object."))?
            .keys()
            .cloned()
            .collect();

        let mut mustache_templates: Vec<MustacheTemplate> = Vec::new();

        for template in template_name_list {

            let script_name: String = template;
            let script_content: ScriptContent = self.es_repository.get_mustache_script(&script_name).await?;
            let mustache_template: MustacheTemplate = MustacheTemplate::new(script_name, script_content);
            mustache_templates.push(mustache_template);

        }

        Ok(mustache_templates)
    }

    #[doc = ""]
    async fn clean_existing_template_files(&self, template_repo_path: &str, current_templates: &[MustacheTemplate]) -> anyhow::Result<()> {
        let repo_path: &Path = Path::new(template_repo_path);
        
        if repo_path.exists() {
            /* 현재 템플릿 이름들을 Set으로 만들어서 빠른 검색 가능하게 함 */ 
            let current_template_names: HashSet<String> = 
                current_templates.iter().map(|t| format!("{}.es", t.script_name)).collect();
            
            /* 디렉토리의 모든 JSON 파일을 검사 */ 
            for entry in std::fs::read_dir(repo_path)? {
                let entry: DirEntry = entry?;
                let path: PathBuf = entry.path();
                
                if let Some(file_name) = path.file_name().and_then(|n| n.to_str()) {
                    if file_name.ends_with(".es") {
                        /* 현재 템플릿에 없는 파일은 삭제 */ 
                        if !current_template_names.contains(file_name) {
                            std::fs::remove_file(&path)?;
                            info!("Removed outdated template file: {}", file_name);
                            println!("Removed outdated template file: {}", file_name);
                        }
                    }
                }
            }
        }
        
        Ok(())
    }

}

#[async_trait]
impl<R: EsRepository> TemplateService for TemplateServiceImpl<R> {
    
    #[doc = "서버기준으로 모든 mustache template 을 가져온뒤 파일에 갱신한다."]
    async fn sync_all_template_from_server(&self) -> anyhow::Result<()> {

        /* server 에 존재하는 모든 mustache template 정보 */
        let mustache_templates: Vec<MustacheTemplate> = self.find_all_mustache_template().await?;
        
        /* mustache template 정보를 저장해두는 디렉토리 경로 */
        let template_repo_path: String = env::var("TEMPLATE_REPO_PATH")?;
        
        /* mustache_templates 정보를 기반으로 template_repo_path 에 접근해서 해당되는 template 의 이름으로 시작하는 json 파일이 있으면 전부지워주고 해당 템플릿 내용으로 업데이트하고
        해당 이름으로 된 파일이 없다면 새로 파일을 만들어주고 template 내용을 붙여넣어서 저장해준다.
         */
        
        /* 디렉토리가 존재하지 않으면 생성 */ 
        let repo_path: &Path = Path::new(&template_repo_path);
        if !repo_path.exists() {
            std::fs::create_dir_all(repo_path)?;
        }
        
        /* 기존 템플릿 파일들 정리 */ 
        self.clean_existing_template_files(&template_repo_path, &mustache_templates).await?;
        
        /* 새로운 템플릿 파일들 저장 */ 
        for template in mustache_templates {
            
            let source: &String = &template.scipt.source;
            let file_name: String = format!("{}.es", template.script_name);
            let file_path: PathBuf = repo_path.join(file_name);
            
            std::fs::write(file_path, source)?;
        }
        
        Ok(())
    }

}