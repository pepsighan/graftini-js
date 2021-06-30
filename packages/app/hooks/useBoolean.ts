import { useCallback, useState } from 'react';

type UseBoolean = [
  boolean,
  {
    on: () => void;
    off: () => void;
    toggle: () => void;
  }
];

export default function useBoolean(value: boolean = false): UseBoolean {
  const [bool, setBool] = useState(value);

  const on = useCallback(() => {
    setBool(true);
  }, []);
  const off = useCallback(() => {
    setBool(false);
  }, []);
  const toggle = useCallback(() => {
    setBool((v) => !v);
  }, []);

  return [bool, { on, off, toggle }];
}
