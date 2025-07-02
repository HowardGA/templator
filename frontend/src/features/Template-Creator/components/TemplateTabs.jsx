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
import { validateTemplateData } from "../utils/templateValidation";
import { validateQuestions } from "../utils/templateValidation";
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
        const updatedQuestions = questions.map((q, index) => ({
            ...q,
            questionIndex: index,
        }));
        setFormData(prev => ({
            ...prev,
            questions: updatedQuestions
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
        setImage(image)
    };

const handleCreateTemplate = async () => {
  try {
     const validation = validateTemplateData({ formData, user });
     const { valid, message } = validateQuestions(formData.questions);

    if (!validation.valid || !valid) {
      messageApi.error(validation.message || message);
      return;
    }

    const payload = {
      ...formData,
      settings: {
        ...formData.settings,
        creatorId: user.id,
        title: formData.settings.title.trim(),
        imageUrl: (image) ? image.image : ''
      },
      tags: formData.tags.map(tag => 
        typeof tag === 'string' ? tag.trim() : tag
      )
    };
    createTemplate(payload);
    console.log(payload)
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
                    <QuestionMaker questions={formData.questions}  onQuestionsChange={handleQuestionsChange}/>
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