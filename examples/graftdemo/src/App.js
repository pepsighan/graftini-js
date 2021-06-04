/** @jsxImportSource @emotion/react */
import { Box, Text as Txt } from "bricks";
import {
  Canvas,
  DragPreview,
  DropMarker,
  Editor,
  useComponentId,
  useCreateComponent,
  useEditorState,
} from "graft";
import { useCallback } from "react";
import IFrame from "./IFrame";

export default function App() {
  return (
    <Editor resolvers={{ Container, Text }}>
      <Menu />
      <IFrame
        style={{
          height: "80vh",
          width: "100%",
          marginTop: 32,
          backgroundColor: "white",
        }}
      >
        {() => (
          <div
            style={{
              width: "100%",
              height: "100vh",
              userSelect: "none",
            }}
          >
            <Canvas />
            <DropMarker />
          </div>
        )}
      </IFrame>
      <DragPreview correction={{ y: 32 + 83 }} />
    </Editor>
  );
}

function Menu() {
  return (
    <div
      style={{
        display: "flex",
        padding: 16,
        justifyContent: "center",
        backgroundColor: "#5894DD",
        position: "sticky",
        top: 0,
      }}
    >
      <button
        {...useCreateComponent({
          type: "Container",
          childAppendDirection: "horizontal",
          isCanvas: true,
        })}
        style={{ padding: 16 }}
      >
        Container
      </button>
      <button
        {...useCreateComponent({ type: "Text" })}
        style={{ padding: 16, marginLeft: 16 }}
      >
        Text
      </button>
    </div>
  );
}

function Container({ children, ...rest }) {
  const id = useComponentId();
  const noChildren = useEditorState(
    useCallback((state) => state[id].childrenNodes.length === 0, [id])
  );

  const border = { color: { r: 0, g: 0, b: 0 }, style: "solid", width: 1 };

  return (
    <Box
      {...rest}
      border={{
        left: border,
        right: border,
        top: border,
        bottom: border,
      }}
      color={{ r: 100, g: 100, b: 230, a: 0.3 }}
      width={{ size: 100, unit: "%" }}
      height={
        noChildren
          ? {
              size: 180,
              unit: "px",
            }
          : "auto"
      }
      padding={{ top: 8, left: 8, right: 8, bottom: 8 }}
    >
      {children}
    </Box>
  );
}

Container.graftOptions = {
  preview: () => (
    <Box
      width={{ size: 100, unit: "px" }}
      height={{ size: 100, unit: "px" }}
      color={{ r: 100, g: 100, b: 200 }}
    />
  ),
};

function Text({ ...rest }) {
  const id = useComponentId();

  return <Txt {...rest}>Click {id}</Txt>;
}

Text.graftOptions = {
  preview: () => (
    <Box
      width={{ size: 100, unit: "px" }}
      height={{ size: 32, unit: "px" }}
      color={{ r: 100, g: 100, b: 200 }}
    />
  ),
};