import {useQuery, useMutation} from '@tanstack/react-query';
import { getTopics, getTags, createTag, createTemplate,updateTemplate, deleteTemplate } from '../services/SettingsTabServices';
import { queryClient } from '../../../lib/queryClient';
import { useAntdApi } from "../../../contexts/MessageContext";
import {useNavigate} from "react-router-dom"

export const useGetTopics = () => {
  return useQuery({
    queryKey: ['topics'],
    queryFn: getTopics,
    staleTime: 60 * 60 * 1000, 
    cacheTime: 24 * 60 * 60 * 1000, 
    retry: 1, 
    refetchOnWindowFocus: false, 
  });
};

export const useGetTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
    staleTime: 60 * 60 * 1000, 
    cacheTime: 24 * 60 * 60 * 1000, 
    retry: 1, 
    refetchOnWindowFocus: false, 
  });
};

export const useCreateTag = () => {
  return useMutation({
    mutationFn: createTag
  })
}

export const useCreateTemplate = () => {
  const { message: messageApi } = useAntdApi();
  const navigate = useNavigate();

  return useMutation({
    mutationKey:['templateCreation'],
    mutationFn: (templateData) => createTemplate(templateData),
     onSuccess: () => {
      messageApi.success('Template created successfully!');
      queryClient.invalidateQueries({
        queryKey: ['latestTemplates']
      });
      navigate('/');
    },
    onError: (error) => {
      console.log(error)
      messageApi.error(error.message || 'Failed to create template');
    },
  })
}

export const useUpdatePayload = () => {
  const { message: messageApi } = useAntdApi();
  const navigate = useNavigate();

  return useMutation({
    mutationKey:['templateUpdate'],
    mutationFn: ({templateData, templateId}) => updateTemplate(templateData,templateId),
     onSuccess: () => {
      messageApi.success('Template updated successfully!');
      queryClient.invalidateQueries({queryKey: ['latestTemplates']});
      queryClient.invalidateQueries({queryKey: ['template']});
      navigate('/');
    },
    onError: (error) => {
      console.log(error)
      messageApi.error(error.message || 'Failed to update template');
    },
  })
}

export const useDeleteTemplate = () => {
    const { message: messageApi } = useAntdApi();
    return useMutation({
        mutationFn: (templateId) => deleteTemplate(templateId),
        onSuccess: () => {
            messageApi.success('Template deleted successfully');
            queryClient.invalidateQueries(['myTemplates']);
        },
        onError: (error) => {
            messageApi.error(error.message || 'Failed to delete template');
        }
    });
};