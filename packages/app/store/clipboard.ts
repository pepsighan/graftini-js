import { PasteComponent } from '@graftini/graft';
import create from 'zustand';

type UseClipboardStore = {
  component?: PasteComponent | null;
  copyComponent(component: PasteComponent): void;
  flush(): void;
};

/**
 * Store that handles the copy, cut and paste actions of the designer.
 */
export const useClipboardStore = create<UseClipboardStore>((set) => ({
  component: null,
  copyComponent(component) {
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
