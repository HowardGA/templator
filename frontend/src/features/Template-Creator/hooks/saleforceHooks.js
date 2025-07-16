import { syncData, getUserData, getSalesforceContactStatus } from "../services/saleforceServices";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAntdApi } from "../../../contexts/MessageContext";


export const useSyncData = () => {
    const { message: messageApi } = useAntdApi();
    return useMutation({
        mutationFn: (userData) => syncData(userData), 
        onSuccess: () => {
            messageApi.success('Data synced successfully');
        },
        onError: (error) => {
            messageApi.error(error.message || 'Failed to sync data');
        }
    });
};

export const useGetUserInfo = (userId) => {
    return useQuery({
        queryKey: ['singleUser', userId],
        queryFn: () => getUserData(userId),
        staleTime: 60 * 60 * 1000, 
        cacheTime: 24 * 60 * 60 * 1000, 
        retry: 1, 
        refetchOnWindowFocus: false, 
    });
};

export const useGetSalesforceContactStatus = () => {
    return useQuery({
        queryKey: ['salesforceContactStatus'], 
        queryFn: getSalesforceContactStatus,
        staleTime: 5 * 60 * 1000, 
        cacheTime: 10 * 60 * 1000, 
    });
};