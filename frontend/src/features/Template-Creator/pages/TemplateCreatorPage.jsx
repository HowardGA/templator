import { Layout } from "antd";
import TemplateTabs from "../components/TemplateTabs";

const TemplateCreatorPage = () => {
    return (
        <Layout style={{ display: 'flex', alignItems: 'center', width:'100%' }}>
            <TemplateTabs />
        </Layout>
    )
}

export default TemplateCreatorPage;