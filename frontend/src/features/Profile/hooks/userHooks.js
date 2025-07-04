import { getUserWithEmailAndName, myForms, myTemplates, sharedWithMe } from "../services/userService";
import {useQuery} from '@tanstack/react-query';

export const useGetUserEmailAndName = () => {
  return useQuery({
    queryKey: ['usersNameEmail'],
    queryFn: getUserWithEmailAndName,
    staleTime: 60 * 60 * 1000, 
    cacheTime: 24 * 60 * 60 * 1000, 
    retry: 1, 
    refetchOnWindowFocus: false, 
  });
};

export const useSharedWithMe = (userId) => {
  return useQuery({
    queryKey: ['sharedWithMe'],
    queryFn: () => sharedWithMe(userId),
    staleTime: 60 * 60 * 1000, 
    cacheTime: 24 * 60 * 60 * 1000, 
    retry: 1, 
    refetchOnWindowFocus: false, 
  });
};

export const useGetMyTemplates = (userId) => {
  return useQuery({
    queryKey: ['myTemplates'],
    queryFn: () => myTemplates(userId),
     staleTime: 60 * 60 * 1000, 
    cacheTime: 24 * 60 * 60 * 1000, 
    retry: 1, 
    refetchOnWindowFocus: false, 
  })
};

export const useGetMyForms = (userId) => {
  return useQuery({
    queryKey: ['myTemplates'],
    queryFn: () => myForms({userId}),
     staleTime: 60 * 60 * 1000, 
    cacheTime: 24 * 60 * 60 * 1000, 
    retry: 1, 
    refetchOnWindowFocus: false, 
  })
};