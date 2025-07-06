import { Select, Spin } from 'antd';
import { useState, useMemo, useEffect } from 'react';
import { debounce } from 'lodash';
import { useGetTags } from '../hooks/settingsHooks';

const TagInputAutoComplete = ({ onChange, initialTags, mode }) => {
    const [options, setOptions] = useState([]);
    const {data: tags, isLoading: tagsLoading} = useGetTags();
    const [selectedTags, setSelectedTags] = useState([]); 
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
    if (initialTags && mode === 'updating') {
        console.log(initialTags)
        const normalized = initialTags.map(tag => tag.id);
        setSelectedTags(normalized);
    }
    }, [initialTags]);

    useEffect(() => {
        if (tags?.data) {
            setOptions(tags.data);
        }
    }, [tags]);

    const fetchMatchingTags = async (searchText) => {
        setSearchLoading(true);
        try {
            if (!searchText.trim()) {
                setOptions(tags.data);
            } else {
                const filtered = tags.data.filter(option =>
                    option.label.toLowerCase().includes(searchText.toLowerCase())
                );
                setOptions(filtered);
            }
        } catch (error) {
            console.error("Failed to filter tags:", error);
            setOptions([]);
        } finally {
            setSearchLoading(false);
        }
    };

    const debouncedFetcher = useMemo(() => debounce(fetchMatchingTags, 300), [tags]);

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
            onSearch={debouncedFetcher} 
            notFoundContent={searchLoading ? <Spin size="small" /> : 'No matching tags'}
            filterOption={false} 
            options={options} 
            tokenSeparators={[',']}
            style={{ width: '100%' }}
        />
    );
};

export default TagInputAutoComplete;