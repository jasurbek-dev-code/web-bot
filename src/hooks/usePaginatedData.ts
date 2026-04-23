import { useQuery } from '@tanstack/react-query';
import { IListResponse } from '@/interfaces/configuration.interface';
import { ISearchParams } from '@/interfaces/params.interface';
import { CommonService } from '@/services/common.service';

const usePaginatedData = <T>(endpoint: string, params?: ISearchParams, enabled: boolean = true) => {
  const queryMethods = useQuery<IListResponse<T>, Error>({
    queryKey: [endpoint, params],
    queryFn: () => CommonService.getPaginatedData<T>(endpoint, params),
    enabled,
  });

  const { results = [], totalPages = 1, totals } = queryMethods.data || {};

  return {
    ...queryMethods,
    data: Array.isArray(queryMethods.data) ? queryMethods.data : results,
    totals: totals,
    totalPages: totalPages,
  };
};

export default usePaginatedData;
