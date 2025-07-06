import TemplatesTable from "../../../components/common/TemplateTable";
import { useSharedWithMe } from "../hooks/userHooks";
import { useAuth } from '../../../contexts/AuthContext';
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";

const Shared = () => {
    const { user } = useAuth();
    const { data: sharedWithMe, isLoading } = useSharedWithMe(user?.id);
    const navigate = useNavigate();

    const navigateToTemplate = (template) => {
        navigate(`/template-preview/${template.id}`)
    }

    if (isLoading) {
        return <Spin />; 
    }

    return (
        <div>
            <TemplatesTable 
                templates={sharedWithMe?.data?.data || []} 
                onSelectRow={(record) => navigateToTemplate(record)}
            />
        </div>
    );
};

export default Shared;