import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { IPost, PostFilters } from '../types/post';
import { postsApi } from '../services/api';

const handleSuccess = (action: string) => {
  message.success(`Post ${action} successfully`);
};

const handleError = (action: string) => {
  message.error(`Failed to ${action} post`);
};

export const usePosts = (filters: PostFilters) => 
  useQuery({
    queryKey: ['posts', filters],
    queryFn: () => postsApi.getPosts(filters),
    staleTime: 1000 * 60 * 5,
  });

export const usePost = (id: string | undefined) => 
  useQuery({
    queryKey: ['post', id],
    queryFn: () => id ? postsApi.getPost(id) : null,
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postsApi.createPost,
    onSuccess: () => { handleSuccess('created'); queryClient.invalidateQueries({ queryKey: ['posts'] }); },
    onError: () => handleError('create'),
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IPost> }) => postsApi.updatePost(id, data),
    onSuccess: (_, variables) => { 
      handleSuccess('updated'); 
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
    },
    onError: () => handleError('update'),
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postsApi.deletePost,
    onSuccess: () => { handleSuccess('deleted'); queryClient.invalidateQueries({ queryKey: ['posts'] }); },
    onError: () => handleError('delete'),
  });
};