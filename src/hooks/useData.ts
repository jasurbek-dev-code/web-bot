import { useQuery } from '@tanstack/react-query';
import { ISearchParams } from '@/interfaces/params.interface';
import { CommonService } from '@/services/common.service';

const useData = <T>(
  endpoint: string,
  enabled: boolean = true,
  params?: ISearchParams,
  keys: (string | number)[] = []
) => {
  return useQuery<T, Error>({
    queryKey: [endpoint, params, ...keys],
    queryFn: () => CommonService.getData<T>(endpoint, params),
    enabled,
  });
};

export default useData;
