import { Select, Spin } from 'antd';
import { useState, useMemo, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { useGetUserEmailAndName } from '../../Profile/hooks/userHooks';

const RestrictedTemplateComponent = ({ onChange, restrictions = [] }) => {
    const [options, setOptions] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]); 
    const {data: users, isLoading} = useGetUserEmailAndName();
    const [searchLoading, setSearchLoading] = useState(false);
    const allOptions = useRef([]); 

    useEffect(() => {
        setSelectedUsers(restrictions);
    }, [restrictions]);

    useEffect(() => {
        if (users?.data) {
            const formattedOptions = users.data.map(user => ({
                value: user.id,
                label: `${user.firstName} ${user.lastName} (${user.email})`,
                userData: user 
            }));
            allOptions.current = formattedOptions; 
            setOptions(formattedOptions);
        }
    }, [users]);

    const filterUsers = (searchText) => {
        if (!searchText.trim()) return allOptions.current;
         return allOptions.current.filter(option => 
            option.label.toLowerCase().includes(searchText.toLowerCase()) ||
            option.userData.email.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    const debouncedFetcher = useMemo(() => debounce((searchText) => {
        setSearchLoading(true);
        try {
            const filtered = filterUsers(searchText);
            setOptions(filtered);
        } catch (error) {
            console.error("Failed to filter users:", error);
            setOptions(allOptions.current);
        } finally {
            setSearchLoading(false);
        }
    }, 300), []);

    const handleChange = (value) => {
        setSelectedUsers(value);
        if (onChange) {
            onChange(value); 
        }
    };
    return (
         <Select
            mode="multiple"
            placeholder="Search by name or email"
            value={selectedUsers} 
            onChange={handleChange}
            onSearch={debouncedFetcher} 
            notFoundContent={searchLoading ? <Spin size="small" /> : 'No matching users'}
            filterOption={false} 
            options={options} 
            tokenSeparators={[',']}
            style={{ width: '100%', marginTop: '1rem' }}
            loading={isLoading}
        />
    );
}

export default RestrictedTemplateComponent;