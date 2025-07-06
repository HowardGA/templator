import {useMutation} from '@tanstack/react-query';
import { useAntdApi } from '../../../contexts/MessageContext';
import { fillForm } from '../services/formService';
import {useNavigate} from 'react-router-dom';


export const useFillForm = () => {
    const navigate = useNavigate();
    const { message: messageApi } = useAntdApi();
    return useMutation(({
        mutationFn: ( formData ) => fillForm(formData),
        onSuccess: (data) => {
            messageApi.success(data.message || 'Form filled successfully');
            console.log(data);
        },
        onError: (data) => {
            console.log(data);
            messageApi.error(data.message || 'Failed to fill form');
        }
    }))
};