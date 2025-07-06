import { Typography, Card, Button, Divider, Select, Radio, Spin } from "antd";
import { useState, useEffect } from "react";
import MDE from "./MDE";
import ReactMarkdown from 'react-markdown';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons'; 
import ImageInput from "./ImageInput";
import TagInputAutoComplete from "./TagInputAutoComplete";
import RestrictedTemplateComponent from "./RestrictedTemplateComponent";
import { useGetTopics } from "../hooks/settingsHooks";
const { Title } = Typography;

const MainFormDetails = ({ 
    onSettingsChange, 
    onRestrictionsChange, 
    onTagsChange, onImageSelection, 
    initialSettings = {},
    initialTags = [],
    initialRestrictions = [],
    mode
}) => {
    const [title, setTitle] = useState(initialSettings.title || "Your Template Title");
    const [description, setDescription] = useState(initialSettings.description || "");
    const [editingDescription, setEditingDescription] = useState(false);
    const [tempDescription, setTempDescription] = useState("");
    const [showRestrictedComponent, setShowRestrictedComponent] = useState(() => {
        const isRestricted = (initialSettings.accessType === 'PUBLIC') ? false : true
        return isRestricted
        }
    );
    const {data: topics, isLoading: topicsLoading} = useGetTopics();

    useEffect(() => {
        if (editingDescription) {
            setTempDescription(description);
        }
    }, [editingDescription, description]);

    const handleTitleChange = (newTitle) => {
        setTitle(newTitle);
        onSettingsChange?.({ title: newTitle });
    };

    const handleEditDescription = () => {
        setEditingDescription(true);
        setTempDescription(description);
    };

     const handleSaveDescription = () => {
        setDescription(tempDescription);
        setEditingDescription(false);
        onSettingsChange?.({ description: tempDescription });
    };

    const handleCancelEditDescription = () => {
        setEditingDescription(false); 
    };

   const handleTopicChange = (topicId) => {
        onSettingsChange?.({ topicId });
    };

    const handleImageChange = (image) => {
        onImageSelection?.({ image });
    };

    const handleAccessChange = (e) => {
        const accessType = e.target.value;
        setShowRestrictedComponent(accessType === 'RESTRICTED');
        onSettingsChange?.({ accessType });
    };

    const descriptionPlaceholder = "Click to add your template description...";

    return (    
        <Card style={{ width: '80%' }}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <Title level={2} editable={{tooltip: 'Click to edit title', onChange:handleTitleChange}} >
                    {title}
                </Title>
                <Divider orientation="left">Description</Divider>
                {!editingDescription ? (
                    <div
                        style={{
                            minHeight: '80px', 
                            padding: '12px 16px', 
                            border: '1px solid #d9d9d9',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            backgroundColor: description ? 'transparent' : '#fafafa',
                            color: description ? 'inherit' : '#bfbfbf', 
                            display: 'flex',
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            transition: 'background-color 0.3s', 
                        }}
                        onClick={handleEditDescription}
                    >
                        <div style={{ flexGrow: 1 }}> 
                            {description ? (
                                <ReactMarkdown>{description}</ReactMarkdown>
                            ) : (
                                <span>{descriptionPlaceholder}</span>
                            )}
                        </div>
                        <Button
                            icon={<EditOutlined />}
                            type="text"
                            onClick={(e) => { e.stopPropagation(); handleEditDescription(); }}
                            style={{ marginLeft: '10px' }} 
                        />
                    </div>
                ) : (
                    <div>
                        <MDE
                            initialContent={tempDescription}
                            onContentChange={setTempDescription}
                        />
                        <div style={{ marginTop: '15px', textAlign: 'right' }}>
                            <Button
                                icon={<CloseOutlined />}
                                onClick={handleCancelEditDescription}
                                style={{ marginRight: '8px' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={handleSaveDescription}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                )}
                <Divider orientation="left">Topic</Divider>
               {topicsLoading ? (
                    <Spin />
                    ) : (
                    <Select
                        style={{ width: '100%' }}
                        allowClear
                        options={topics?.data || []}
                        placeholder="Select a topic"
                        onChange={handleTopicChange}
                        value={initialSettings.topicId || null}
                    />
                )}
                <Divider orientation="left">Image (optional)</Divider>
                    <ImageInput onImageUploaded={handleImageChange} initialImage={initialSettings.imageUrl}/>
                <Divider orientation="left">Tags</Divider>
                    <TagInputAutoComplete onChange={onTagsChange} initialTags={initialTags} mode={mode}/>
                <Divider orientation="left">Access</Divider>
                    <Radio.Group
                        options={[
                            { value: 'PUBLIC', label: 'Public' },
                            { value: 'RESTRICTED', label: 'Restricted' },
                        ]}
                        onChange={handleAccessChange}
                        value={initialSettings.accessType}
                    />
                    {
                        showRestrictedComponent && <RestrictedTemplateComponent onChange={onRestrictionsChange} restrictions={initialRestrictions}/>
                    }
            </div>
        </Card>
    );
}

export default MainFormDetails