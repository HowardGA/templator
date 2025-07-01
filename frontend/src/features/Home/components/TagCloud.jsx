import { Flex, Tag, Spin, Typography } from "antd";
import { useGetTags } from "../../Template-Creator/hooks/settingsHooks";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const { Text } = Typography;

const TagCloud = () => {
    const { data: tags, isLoading } = useGetTags();
    const navigate = useNavigate();
    const [selectedTag, setSelectedTag] = useState(null);

    if (isLoading) return <Spin />;

    if (!tags?.data.length) return <Text type="secondary">No tags available</Text>;

    const handleTagClick = (tagName) => {
        setSelectedTag(tagName);
        navigate(`/search?tag=${encodeURIComponent(tagName)}`);
    };

    return (
        <Flex 
            wrap="wrap" 
            gap="small" 
            align="center"
            style={{ 
                padding: '16px',
                borderRadius: 8,
                alignContent:'center',
                justifyContent:'center',
            }}
        >
            {tags.data.map((tag) => {
                return (
                    <Tag
                        key={tag.id || tag.name}
                        onClick={() => handleTagClick(tag.label)}
                        color="purple"
                        style={{
                            cursor: 'pointer',
                            padding: '4px 8px',
                            marginBottom: 4
                        }}
                    >
                        {tag.label}
                    </Tag>
                );
            })}
        </Flex>
    );
};

export default TagCloud;