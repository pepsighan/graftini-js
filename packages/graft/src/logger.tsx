import React, { useEffect } from 'react';
import { useEditorStoreApiInternal } from './store/schema';

/**
 * This component is only used during development. It logs any changes to the editor
 * store.
 */
/** @internal */
export default function Logger() {
  const { subscribe } = useEditorStoreApiInternal();
  useEffect(() => subscribe((state) => console.log(state)));
  return <></>;
}
