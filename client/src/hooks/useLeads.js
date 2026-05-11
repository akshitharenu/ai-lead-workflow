import { useQuery } from '@tanstack/react-query';
import { getLeads } from '../api/leads';

const useLeads = (filters = {}) => {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: () => getLeads(filters),
    refetchOnWindowFocus: false,
  });
};

export default useLeads;
