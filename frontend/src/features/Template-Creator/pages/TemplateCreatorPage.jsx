import { Layout, Spin } from "antd";
import TemplateTabs from "../components/TemplateTabs";
import { useLocation } from 'react-router-dom';
import { useTemplateDetails } from "../../Home/hooks/mainPageHooks";

const TemplateCreatorPage = () => {
    const location = useLocation();
    const templateData = location.state?.templateData;
    console.log(templateData)
    const {
        data: template,
        isLoading: templateLoading,
    } = useTemplateDetails(templateData?.id, null, {
        enabled: !!templateData && !!templateData.id, 
    });


    return (
        <Layout style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            {templateLoading ? (
                <Spin />
            ) : (
                <>
                    {templateData ? (
                        <TemplateTabs templateData={template.data} mode="editing" />) : (
                        <TemplateTabs mode="creating" />
                    )}
                </>
            )}
        </Layout>
    )
}

export default TemplateCreatorPage;