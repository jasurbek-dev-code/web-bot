import { CommonService } from '@/services/common.service';
import { showMessage } from '@/utils/alert';
import { useMutation } from '@tanstack/react-query';

const useUpdate = <TVariables, TData, TError>(
  endpoint: string,
  id?: string | number | boolean | null,
  requireId: boolean = true,
  method: 'put' | 'patch' = 'put',
  successMessage: string = 'Updated successfully'
) => {
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (data: TVariables) => {
      if (requireId && !id && id !== 0) {
        showMessage(
          `The operation cannot be completed because a valid ID was not provided. Please ensure you pass a valid ID when updating data at endpoint: ${endpoint}`,
          'error'
        );
        return Promise.reject();
      }

      return method === 'put'
        ? CommonService.updateData(endpoint, data, id ? id.toString() : '')
        : CommonService.partialUpdateData(endpoint, data, id ? id.toString() : '');
    },
    onSuccess: () => showMessage(successMessage, 'success'),
  });
};

export default useUpdate;
