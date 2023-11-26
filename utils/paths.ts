export const getTitle = (path: string) => {
  switch (path) {
    case '/dashboard/assistant':
      return 'Assistant';
    case '/dashboard/integrations':
      return 'Integrations';
    case '/dashboard/files':
      return 'Files';
    default:
      return 'Dashboard';
  }
};
