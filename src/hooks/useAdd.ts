import { CommonService } from '@/services/common.service';
import { showMessage } from '@/utils/alert';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useAdd = <TVariables, TData, TError>(
  endpoint: string,
  successMessage: string = 'Saved successfully',
  queryKey: string[] = ['service-types']
) => {
  const queryClient = useQueryClient();
  return useMutation<TData, TError, TVariables>({
    mutationFn: (data: TVariables) => CommonService.addData<TVariables, TData>(endpoint, data),
    onSuccess: () => {
      showMessage(successMessage, 'success');
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
    },
  });
};

export default useAdd;
