import { useMutation } from '@tanstack/react-query';
import { useAntdApi } from '../../../contexts/MessageContext';
import { fillForm, updateForm, deleteForm } from '../services/formService';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '../../../lib/queryClient';


export const useFillForm = () => {
    const navigate = useNavigate();
    const { message: messageApi } = useAntdApi();
    return useMutation(({
        mutationFn: (formData) => fillForm(formData),
        onSuccess: (data) => {
            messageApi.success(data.message || 'Form filled successfully');
            navigate('/');
        },
        onError: (data) => {
            console.log(data);
            messageApi.error(data.message || 'Failed to fill form');
        }
    }))
};

export const useUpdateForm = () => {
    const navigate = useNavigate();
    const { message: messageApi } = useAntdApi();
    return useMutation(({
        mutationFn: ({ formId, updatedAnswers }) => updateForm(formId, updatedAnswers),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['formDetails'] })
            messageApi.success(data.message || 'Form updated successfully');
            navigate('/profile')
        },
        onError: (data) => {
            console.log(data);
            messageApi.error(data.message || 'Failed to update form');
        }
    }))
};

export const useDeleteForm = () => {
    const { message: messageApi } = useAntdApi();
    return useMutation({
        mutationFn: (formId) => deleteForm(formId),
        onSuccess: () => {
            messageApi.success('Form deleted successfully');
            queryClient.invalidateQueries(['myForms']);
        },
        onError: (error) => {
            messageApi.error(error.message || 'Failed to delete form');
        }
    });
};