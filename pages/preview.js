import PreviewNavigation from 'components/preview/PreviewNavigation';
import Render from 'components/Render';
import { useCallback } from 'react';
import { useEditorState } from 'store/editor';

export default function Preview() {
  const markup = useEditorState(useCallback((state) => state.markup, []));

  return (
    <>
      <PreviewNavigation />
      <Render markup={markup} />
    </>
  );
}
