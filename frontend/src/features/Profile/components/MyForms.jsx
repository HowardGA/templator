import FormsTable from "../../../components/common/FormTable";
import { useGetMyForms } from "../hooks/userHooks";
import { Alert, Spin } from "antd";
import TableToolbar from "../../../components/common/TableToolbar";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {useDeleteForm} from "../../FillForm/hooks/formHook";

const MyForms = ({userId}) => {
    const {data: myForms, isLoading: myFormsLoading} = useGetMyForms(userId);
    const {mutate: deleteForm} = useDeleteForm();
    const [selectedRow, setSelectedRow] = useState(null);
    const navigate = useNavigate();

    if (myFormsLoading) {
        return <Spin />; 
    }

    const forms = myForms?.data?.data || [];
    console.log(forms)
    
    const handleView = (item) => {
        navigate(`/teamplete-fill/${item.id}`, {
        state: { mode: 'view' }
        });
    };

    const handleEdit = (item) => {
        navigate(`/teamplete-fill/${item.id}`, {
        state: { mode: 'updating' }
        });
    };

    const handleDelete = (item) => {
        deleteForm(item.id);
    };

    const handleCreate = (item) => {
        navigate(`/teamplete-fill/${item.template.id}`);
    };
    
   if (forms.length === 0) {
        return <Alert message="You haven't filled any forms yet" type="info" showIcon />;
    }

    return (
        <>
            <TableToolbar
                selectedItem={selectedRow}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCreate={handleCreate}
            />
            <FormsTable 
                form={forms}  
                onSelectRow={(record) => setSelectedRow(record)}
            />
        </>
    );
};

export default MyForms;