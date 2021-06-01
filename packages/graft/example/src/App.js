import { Box, Button, ChakraProvider, Flex } from '@chakra-ui/react';
import { Canvas, Editor, useComponentId, useCreateComponent, useEditorState } from 'graft';
import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

function IFrame({ children }) {
  const [ref, setRef] = useState();
  const container = ref?.contentWindow?.document?.body;

  return (
    <Box as="iframe" ref={setRef} mt={16} title="iframe" width="100%" height="100vh" bg="white">
      {container && createPortal(children, container)}
    </Box>
  );
}

export default function App() {
  return (
    <ChakraProvider>
      <Editor resolvers={{ Container, Button: MyButton }}>
        <Menu />
        <IFrame>
          <Canvas />
        </IFrame>
      </Editor>
    </ChakraProvider>
  );
}

function Menu() {
  return (
    <Flex p={4} justifyContent="center" bg="blue.400" position="sticky" top={0}>
      <Button {...useCreateComponent({ type: 'Container' })}>Container</Button>
      <Button {...useCreateComponent({ type: 'Button' })} ml={2}>
        Button
      </Button>
    </Flex>
  );
}

function Container({ children, border, backgroundColor, ...rest }) {
  const id = useComponentId();
  const noChildren = useEditorState(
    useCallback((state) => state[id].childrenNodes.length === 0, [id])
  );

  return (
    <div
      {...rest}
      style={{
        p: 1,
        border,
        backgroundColor,
        height: noChildren ? 180 : null,
      }}
    >
      {id}
      <div>{children}</div>
    </div>
  );
}

Container.graftOptions = {
  display: 'block',
  isCanvas: true,
  defaultProps: {
    border: '1px solid #000000',
    backgroundColor: '#95da53',
  },
};

function MyButton(props) {
  const id = useComponentId();
  return (
    <button {...props} style={{ padding: 8, background: '#dadada' }}>
      Click {id}
    </button>
  );
}

MyButton.graftOptions = {
  display: 'inline',
};
