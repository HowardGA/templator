import TemplatesTable from "../../../components/common/TemplateTable";
import { useSharedWithMe } from "../hooks/userHooks";
import { useAuth } from '../../../contexts/AuthContext';
import { Spin } from "antd";

const Shared = () => {
    const { user } = useAuth();
    const { data: sharedWithMe, isLoading } = useSharedWithMe(user?.id);

    if (isLoading) {
        return <Spin />; 
    }

    return (
        <div>
            <TemplatesTable templates={sharedWithMe?.data?.data || []} />
        </div>
    );
};

export default Shared;