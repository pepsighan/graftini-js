import create from 'zustand';
import { ComponentNode } from '@graftini/graft';

type UseClipboardStore = {
  component?: ComponentNode | null;
  copyComponent(component: ComponentNode): void;
  flush(): void;
};

/**
 * Store that handles the copy, cut and paste actions of the designer.
 */
export const useClipboardStore = create<UseClipboardStore>((set) => ({
  component: null,
  copyComponent(component: ComponentNode) {
    set({
      component,
    });
  },
  flush() {
    set({
      component: null,
    });
  },
}));
