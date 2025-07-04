import FormsTable from "../../../components/common/FormTable";
import { useGetMyForms } from "../hooks/userHooks";
import { Alert, Spin } from "antd";

const MyForms = ({userId}) => {
    const {data: myForms, isLoading: myFormsLoading} = useGetMyForms(userId);

    if (myFormsLoading) {
        return <Spin />; 
    }

    const forms = myForms?.data?.data || [];
    
   if (forms.length === 0) {
        return <Alert message="You haven't filled any forms yet" type="info" showIcon />;
    }

    return <FormsTable form={forms} />;
};

export default MyForms;