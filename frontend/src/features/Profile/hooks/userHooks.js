import { getUserWithEmailAndName } from "../services/userService";
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