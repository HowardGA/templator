import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLatestTemplates, getTemplateDetails,
  getTemplateComments, getTemplateLikes, addLike,
  addComment, removeLike
} from '../services/mainPageServices';
import { useAntdApi } from '../../../contexts/MessageContext';

export const useLatestTemplates = (page, limit) => {
  return useQuery({
    queryKey: ['latestTemplates', page, limit],
    queryFn: () => getLatestTemplates(page, limit),
    refetchOnWindowFocus: true,
    retry: 1,
    keepPreviousData: true
  });
};

export const useTemplateDetails = (templateId, userId) => {
  return useQuery({
    queryKey: ['template', templateId, userId],
    queryFn: () => getTemplateDetails(templateId, userId),
    enabled: !!templateId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTemplateLikes = (templateId, page = 1) => {
  return useQuery({
    queryKey: ['templateLikes', templateId, page],
    queryFn: () => getTemplateLikes(templateId, page),
    enabled: !!templateId,
    keepPreviousData: true,
  });
};

export const useAddLike = () => {
  const queryClient = useQueryClient();
  const { message: messageApi } = useAntdApi();
  return useMutation({
    mutationFn: ({ templateId, userId }) => addLike(templateId, userId),
    onSuccess: (data, templateId) => {
      messageApi.success(data.message || 'Like added successfully');
      queryClient.invalidateQueries(['templateLikes', templateId]);
    },
    onError: (data) => {
      messageApi.error(data.message || 'Failed to add like')
    }
  });
};

export const useRemoveLike = () => {
  const queryClient = useQueryClient();
  const { message: messageApi } = useAntdApi();
  return useMutation({
    mutationFn: ({ templateId, userId }) => removeLike(templateId, userId),
    onSuccess: (data, templateId) => {
      messageApi.success(data.message || 'Like removed successfully');
      queryClient.invalidateQueries(['templateLikes', templateId]);
    },
    onError: (data) => {
      messageApi.error(data.message || 'Failed to remove like')
    }
  });
};

export const useTemplateComments = (templateId, page = 1) => {
  return useQuery({
    queryKey: ['templateComments', templateId, page],
    queryFn: () => getTemplateComments(templateId, page),
    enabled: !!templateId,
    keepPreviousData: true,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  const { message: messageApi } = useAntdApi();
  return useMutation({
    mutationFn: ({ templateId, content, currentUserId }) => addComment(templateId, content, currentUserId),
    onSuccess: (data, { templateId }) => {
      messageApi.success(data.message || 'Comment added successfully');
      queryClient.invalidateQueries(['templateComments', templateId]);
    },
    onError: (data) => {
      messageApi.error(data.message || 'Failed to add comment')
    }
  });
};