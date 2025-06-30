import { useQuery } from '@tanstack/react-query';
import { getLatestTemplates } from '../services/mainPageServices';

export const useLatestTemplates = (page, limit) => {
    return useQuery({
        queryKey: ['latestTemplates', page, limit],
        queryFn: () => getLatestTemplates(page, limit),
        refetchOnWindowFocus: true,
        retry: 1,
        keepPreviousData: true
    });
};