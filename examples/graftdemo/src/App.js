/** @jsxImportSource @emotion/react */
import { Box, Text as Txt } from 'bricks';
import {
  Canvas,
  DragPreview,
  DrawMarker,
  DropMarker,
  Editor,
  useComponentId,
  useCreateComponent,
  useForgetCreateComponent,
} from 'graft';
import { forwardRef } from 'react';
import IFrame from './IFrame';

export default function App() {
  return (
    <Editor resolvers={{ Container, Text }} iframeCorrection={{ x: 0, y: 70 }}>
      <Menu />
      <IFrame
        style={{
          width: '100%',
          height: 'calc(100vh - 74px)', // Why subtracting +4px than the actual menu height? Don't know.
        }}
      >
        {() => (
          <div
            style={{
              width: '100%',
              height: '100vh',
            }}
          >
            <Canvas />
            <DropMarker color="#3344BB" />
            <DrawMarker color="#3344BB" />
          </div>
        )}
      </IFrame>
      <DragPreview />
    </Editor>
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
    >
      <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>{id}</div>
      {children}
    </Box>
  );
});

Container.graftOptions = {
  preview: () => (
    <Box
      width={{ size: 100, unit: 'px' }}
      height={{ size: 100, unit: 'px' }}
      color={{ r: 100, g: 100, b: 200 }}
    />
  ),
};

const Text = forwardRef(({ width, height, ...rest }, ref) => {
  const id = useComponentId();
  return (
    <Txt ref={ref} {...rest}>
      Click {id}
    </Txt>
  );
});

Text.graftOptions = {
  preview: () => (
    <Box
      width={{ size: 100, unit: 'px' }}
      height={{ size: 32, unit: 'px' }}
      color={{ r: 100, g: 100, b: 200 }}
    />
  ),
};
