import { CommonService } from '@/services/common.service';
import { showMessage } from '@/utils/alert';
import { noopAsync } from '@/utils/common';
import { useMutation } from '@tanstack/react-query';

const useDelete = (
  endpoint: string,
  id?: string | number | boolean | null,
  successMessage: string = 'Deleted successfully'
) => {
  return useMutation({
    mutationFn: (ID?: number) => {
      if (id || ID) {
        return CommonService.deleteData(endpoint, id?.toString() || ID?.toString() || '');
      } else {
        showMessage('ID is required to perform delete operation', 'error');
        return noopAsync();
      }
    },
    onSuccess: () => showMessage(successMessage, 'success'),
  });
};

export default useDelete;
