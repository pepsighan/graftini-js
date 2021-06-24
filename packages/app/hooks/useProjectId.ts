import { createContext, useContext } from 'react';

const ProjectIdContext = createContext(null);
export const ProjectIdProvider = ProjectIdContext.Provider;

export function useProjectId() {
  return useContext(ProjectIdContext);
}
