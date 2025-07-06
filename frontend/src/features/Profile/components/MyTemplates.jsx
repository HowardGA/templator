import TemplatesTable from "../../../components/common/TemplateTable";
import { useGetMyTemplates } from "../hooks/userHooks";
import { Alert, Spin } from "antd";
import TableToolbar from "../../../components/common/TableToolbar";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDeleteTemplate } from "../../Template-Creator/hooks/settingsHooks";


const MyTemplates = ({userId}) => {
    const {data: myTemplates, isLoading: myTemplatesLoading} = useGetMyTemplates(userId);
    const {mutate: deleteTemplate} = useDeleteTemplate();
    const [selectedRow, setSelectedRow] = useState(null);
    const navigate = useNavigate();

    const handleView = (item) => {
        navigate(`/template-preview/${item.id}`, {
        state: { templateData: item, mode: 'view' },
        });
    };

    const handleEdit = (item) => {
        navigate(`/template-creator`, {
        state: { templateData: item, mode: 'updating' },
        });
    };

    const handleDelete = (item) => {
        deleteTemplate(item.id);
    };

    const handleCreate = () => {
        navigate('/template-creator');
    };

    if (myTemplatesLoading) {
        return <Spin />; 
    }

    const templates = myTemplates?.data?.data || [];

   if (templates.length === 0) {
    console.log(myTemplates)
        return <Alert message="You haven't created any templates yet" type="info" showIcon />;
    }

    return(
        <>
            <TableToolbar
                selectedItem={selectedRow}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCreate={handleCreate}
            />
            <TemplatesTable 
                templates={templates}
                onSelectRow={(record) => setSelectedRow(record)}
            />
        </>
    );
};

export default MyTemplates;