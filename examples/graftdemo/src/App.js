/** @jsxImportSource @emotion/react */
import { Box, Text as Txt } from '@graftini/bricks';
import {
  Canvas,
  DragPreview,
  DrawMarker,
  DropMarker,
  Editor,
  useComponentId,
  useCreateComponent,
  useForgetCreateComponent,
  useDrop,
} from '@graftini/graft';
import { forwardRef } from 'react';
import IFrame from './IFrame';

export default function App() {
  return (
    <Editor resolvers={{ Container, Text }}>
      <Menu />
      <Designer />
    </Editor>
  );
}

function Designer() {
  return (
    <div {...useDrop()}>
      <IFrame style={{ width: '100%', height: 'calc(100vh - 74px)' }}>
        {() => (
          <div
            style={{
              width: '100%',
              height: '100vh',
              userSelect: 'none',
            }}
          >
            <Canvas />
            <DropMarker color="#3344BB" />
            <DrawMarker color="#3344BB" />
          </div>
        )}
      </IFrame>
      <DragPreview />
    </div>
  );
}

function Menu() {
  return (
    <div
      style={{
        display: 'flex',
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5894DD',
        position: 'sticky',
        top: 0,
      }}
    >
      <button onClick={useForgetCreateComponent()} style={{ padding: 16 }}>
        Unselect
      </button>
      <button
        onClick={useCreateComponent({
          type: 'Container',
          childAppendDirection: 'horizontal',
          isCanvas: true,
          transformSize: (width, height) => ({ width, height }),
        })}
        style={{ padding: 16, marginLeft: 16 }}
      >
        Container
      </button>
      <button
        onClick={useCreateComponent({ type: 'Text' })}
        style={{ padding: 16, marginLeft: 16 }}
      >
        Text
      </button>
    </div>
  );
}

const Container = forwardRef(({ children, width, height, ...rest }, ref) => {
  const id = useComponentId();
  const border = { color: { r: 0, g: 0, b: 0 }, style: 'solid', width: 1 };

  return (
    <Box
      ref={ref}
      isEditor
      {...rest}
      border={{
        left: border,
        right: border,
        top: border,
        bottom: border,
      }}
      color={{ r: 100, g: 100, b: 230, a: 0.3 }}
      width={{ size: width, unit: 'px' }}
      height={{ size: height, unit: 'px' }}
      padding={{ top: 16, left: 16, right: 16, bottom: 16 }}
      justifyContent="space-evenly"
      position="relative"
      overflow={{ x: 'hidden', y: 'hidden' }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {id}
      </div>
      {children}
    </Box>
  );
});

const Text = forwardRef(({ ...rest }, ref) => {
  const id = useComponentId();
  return (
    <Txt ref={ref} isEditor {...rest}>
      <div
        style={{
          pointerEvents: 'none',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        Click {id}
      </div>
    </Txt>
  );
});
