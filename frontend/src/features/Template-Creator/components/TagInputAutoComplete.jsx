import { Select } from 'antd';
import { useState, useEffect } from 'react';
import { useGetTags } from '../hooks/settingsHooks';

const TagInputAutoComplete = ({ onChange, initialTags, mode }) => {
    const [options, setOptions] = useState([]);
    const {data: tags} = useGetTags();
    const [selectedTags, setSelectedTags] = useState([]); 

    useEffect(() => {
        if (initialTags && mode === 'editing') {
            const normalized = initialTags.map(tag => ({
                label: tag.name,
                value: tag.id,
            }));
            setSelectedTags(normalized);
        }
    }, []);

    useEffect(() => {
        if (tags?.data) {
            setOptions(tags.data);
        }
    }, [tags]);

    const handleChange = (tagNames) => {
        setSelectedTags(tagNames);
        onChange?.(tagNames);
    };

    return (
        <Select
            mode="tags"
            placeholder="Enter tags"
            value={selectedTags} 
            onChange={handleChange}
            options={options} 
            tokenSeparators={[',']}
            style={{ width: '100%' }}
            filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
            }
        />
    );
};

export default TagInputAutoComplete;