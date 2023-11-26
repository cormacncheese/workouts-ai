export const getTitle = (path: string) => {
  switch (path) {
    case '/dashboard/trainer':
      return 'Trainer';
    case '/dashboard/saved':
      return 'Saved Workouts';
    default:
      return 'Dashboard';
  }
};
