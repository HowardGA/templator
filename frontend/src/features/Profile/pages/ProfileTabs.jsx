import { Tabs } from "antd";
import { FaUser, FaWpforms } from "react-icons/fa";
import { ImInsertTemplate } from "react-icons/im";
import { useAuth } from '../../../contexts/AuthContext';
import MyTemplates from "../components/MyTemplates";
import MyForms from "../components/MyForms";

const { TabPane } = Tabs;

const ProfileTabs = () => {
    const {user} = useAuth();

    return (
        <Tabs
            defaultActiveKey="settings"
            style={{width:'100%'}}
            centered
        >
            <TabPane tab="User Data" key="userData"  icon={<FaUser/>}>
               
            </TabPane>

            <TabPane tab="Templates By User" key="templatesByUser" icon={<ImInsertTemplate/>}>
                <MyTemplates userId={user.id}/>
            </TabPane>

            <TabPane tab="Submitted Forms" key="forms" icon={<FaWpforms/>}>
                <MyForms userId={user.id}/>
            </TabPane>
        </Tabs>
    );
};

export default ProfileTabs;