import {useQuery, useMutation} from '@tanstack/react-query';
import { getTopics, getTags, createTag, createTemplate } from '../services/SettingsTabServices';
import { useAntdApi } from "../../../contexts/MessageContext";

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

  return useMutation({
    mutationKey:['templateCreation'],
    mutationFn: (templateData) => createTemplate(templateData),
     onSuccess: () => {
      messageApi.success('Template created successfully!');
    },
    onError: (error) => {
      console.log(error)
      messageApi.error(error.message || 'Failed to create template');
    },
  })
}