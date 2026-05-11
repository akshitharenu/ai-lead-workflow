import { create } from 'zustand';

const useWorkflowStore = create((set) => ({
  stats: { total: 0, hot: 0, warm: 0, cold: 0, today: 0, avgScore: 0 },
  setStats: (stats) => set({ stats }),
  
  refreshTrigger: 0,
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));

export default useWorkflowStore;
