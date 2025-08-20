use crate::common::common::*;

use crate::enums::template_status::*;

#[async_trait]
pub trait TemplateService {
    async fn sync_all_template_from_server(&self) -> anyhow::Result<()>;
    async fn sync_specific_template_from_server(&self, template_name: &str) -> anyhow::Result<TemplateStatus>;
}
