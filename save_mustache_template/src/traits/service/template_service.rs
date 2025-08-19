use crate::common::common::*;

use crate::model::script_content::*;

#[async_trait]
pub trait TemplateService {
    //async fn find_all_mustache_template(&self) -> anyhow::Result<Vec<ScriptContent>>;
    async fn sync_all_template_from_server(&self) -> anyhow::Result<()>;
}
