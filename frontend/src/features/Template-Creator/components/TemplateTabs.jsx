import { Tabs, Flex, Button, Spin } from "antd";
import { IoIosSettings, IoMdAnalytics } from "react-icons/io";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { MdMenuBook } from "react-icons/md";
import MainFormDetails from "./MainFormDetails";
import QuestionMaker from "./QuestionMaker";
import { useState } from 'react';
import {useAuth} from '../../../contexts/AuthContext';
import { useCreateTemplate,useUpdatePayload } from "../hooks/settingsHooks";
import { useAntdApi } from "../../../contexts/MessageContext";
import { validateData, TemplatePayload } from "../utils/templateValidation";
const { TabPane } = Tabs;

const TemplateTabs = ({templateData, mode}) => {
    console.log(templateData)
    const {user, isLoading } = useAuth();
    const { message: messageApi } = useAntdApi();
    const {mutate: updateTemplate } = useUpdatePayload();
    const [formData, setFormData] = useState(() => {
        if (!templateData) {
            return {
                settings: {
                    title: '',
                    description: '',
                    topicId: null,
                    imageUrl: null,
                    deleteImgUrl: null,
                    accessType: 'PUBLIC'
                },
                questions: [],
                restrictions: [],
                tags: []
            }
        }
        return {
            settings: {
                title: templateData.title,
                description: templateData.description,
                topicId: templateData.topic?.id || null,
                imageUrl: templateData.imageUrl,
                deleteImgUrl: templateData.deleteImgUrl,
                accessType: templateData.accessType
            },
            questions: templateData.questions.map((q, index) => ({
                ...q,
                key: q.id,
                questionIndex: index
            })),
            tags: templateData.tags.map(tag => ({
                id: tag.tag.id,
                name: tag.tag.name
            })),
            restrictions: [] 
        };
    });
    console.log(mode)
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
    const handleImageSelection = ({ imageUrl, deleteImgUrl }) => {
        setFormData(prev => ({
        ...prev,
        settings: {
            ...prev.settings,
            imageUrl: imageUrl,      
            deleteImgUrl: deleteImgUrl 
        }
    }));
    };

    const handleUpdateTemplate = async () => {
        try {
            const error = await validateData(formData, user.id);
            if (error) {
                messageApi.error(error);
            return;
            }
            const payload = TemplatePayload(formData, user.id);
            console.log(payload)
            updateTemplate({templateData: payload, templateId: templateData.id});
        } catch (error) {
            console.error('Template update failed:', error);
            messageApi.error("Failed to update template.");
        }
    };

    const handleCreateTemplate = async () => {
        try {
            const error = await validateData(formData, user.id);
            if (error) {
                messageApi.error(error);
            return;
            }
            const payload = TemplatePayload(formData, user.id);
            createTemplate(payload);
        } catch (error) {
            console.error('Template creation failed:', error);
            messageApi.error("Failed to create template.");
        }
    };

    if (isLoading) {
        return <Spin/>;
    }
    return (
        <>
            <Button 
                type="primary" 
                onClick={mode === 'editing' ? handleUpdateTemplate : handleCreateTemplate}
                >
                {mode === 'editing' ? 'Update Template' : 'Create Template'}
            </Button>
            <Tabs
                defaultActiveKey="settings"
                style={{width:'100%'}}
                centered
            >
                 {(mode === 'creating' || mode === 'editing') &&
                    <>
                        <TabPane tab="Settings" key="settings"  icon={<IoIosSettings/>}>
                            <Flex gap="middle" align='center' justify='center' vertical>
                                <MainFormDetails 
                                    onSettingsChange={handleSettingsChange}
                                    onRestrictionsChange={handleRestrictionsChange}
                                    onTagsChange={handleTagsChange}
                                    onImageSelection={handleImageSelection}
                                    initialSettings={formData.settings}
                                    initialTags={formData.tags}
                                    initialRestrictions={formData.restrictions}
                                    mode={mode}
                                />
                            </Flex>
                        </TabPane>

                        <TabPane tab="Questions" key="questions" icon={<BsFillQuestionSquareFill/>}>
                            <Flex gap="middle" align='center' justify='center' vertical>
                                <QuestionMaker questions={formData.questions}  onQuestionsChange={handleQuestionsChange}/>
                            </Flex>
                        </TabPane>
                    </>
                }
                {mode === 'editing' &&
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