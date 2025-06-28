import { Tabs, Flex, Button, Spin } from "antd";
import { IoIosSettings, IoMdAnalytics } from "react-icons/io";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { MdMenuBook } from "react-icons/md";
import MainFormDetails from "./MainFormDetails";
import QuestionMaker from "./QuestionMaker";
import { useState } from 'react';
import {useAuth} from '../../../contexts/AuthContext';
import { useCreateTemplate } from "../hooks/settingsHooks";
import { useAntdApi } from "../../../contexts/MessageContext";

const { TabPane } = Tabs;

const TemplateTabs = ({templateId, mode}) => {
    const {user, isLoading } = useAuth();
    const { message: messageApi } = useAntdApi();
    const [image, setImage] = useState();
    const [formData, setFormData] = useState({
        settings: {
            title: '',
            description: '',
            topicId: null,
            imageUrl: null,
            accessType: 'PUBLIC'
        },
        questions: [],
        restrictions: [],
        tags: []
    });
    const {mutate:createTemplate, isPending: templateIsPending} = useCreateTemplate();

    const handleSettingsChange = (newSettings) => {
        setFormData(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                ...newSettings
            }
        }));
    };

    const handleQuestionsChange = (questions) => {
        setFormData(prev => ({
            ...prev,
            questions
        }));
    };

    const handleRestrictionsChange = (restrictions) => {
        setFormData(prev => ({
            ...prev,
            restrictions
        }));
    };

    const handleTagsChange = (tags) => {
        setFormData(prev => ({
            ...prev,
            tags
        }));
    };
    const handleImageSelection = (image) => {
        console.log(image)
        setImage(image)
    };

const handleCreateTemplate = async () => {
  try {
    if (!formData.settings.title?.trim()) {
      messageApi.error('Template title is required');
      return;
    }

    if(!user){
        messageApi.warning('No user loaded');
        return;
    }

    if(!image) {
        messageApi.warning('No image URL');
        return;
    }
    const payload = {
      ...formData,
      settings: {
        ...formData.settings,
        creatorId: user.id,
        title: formData.settings.title.trim(),
        imageUrl: image.image
      },
      tags: formData.tags.map(tag => 
        typeof tag === 'string' ? tag.trim() : tag
      )
    };
    await createTemplate(payload);
  } catch (error) {
    console.error('Template creation failed:', error);
  }
};
if (isLoading) {
    return <Spin/>;
  }
    return (
        <>
            <Button 
                type="primary" 
                onClick={handleCreateTemplate}
            >
                Create Template
            </Button>
            <Tabs
                defaultActiveKey="settings"
                style={{width:'100%'}}
                centered
            >
                <TabPane tab="Settings" key="settings"  icon={<IoIosSettings/>}>
                    <Flex gap="middle" align='center' justify='center' vertical>
                        <MainFormDetails 
                            onSettingsChange={handleSettingsChange}
                            onRestrictionsChange={handleRestrictionsChange}
                            onTagsChange={handleTagsChange}
                            onImageSelection={handleImageSelection}
                        />
                    </Flex>
                </TabPane>

                <TabPane tab="Questions" key="questions" icon={<BsFillQuestionSquareFill/>}>
                    <QuestionMaker onQuestionsChange={handleQuestionsChange}/>
                </TabPane>

                {mode === 'creating' &&
                    <>
                        <TabPane tab="Submissions" key="submissions" icon={<MdMenuBook/>}>
                        </TabPane>
                        
                        <TabPane tab="Analytics" key="analytics" icon={<IoMdAnalytics/>}>
                        </TabPane>
                    </>
                }

            </Tabs>
        </>
    );
}

export default TemplateTabs;