import { componentRender } from 'canvasComponents';
import { ComponentMap } from 'graft';

type ComponentRenderProps = {
  componentId: string;
  componentMap: ComponentMap;
};

export default function ComponentRender({ componentId, componentMap }: ComponentRenderProps) {
  const { type, props, isCanvas, childrenNodes } = componentMap[componentId];
  const Render = componentRender[type];

  const { children, ...rest } = props;

  return (
    <Render
      {...rest}
      children={
        isCanvas
          ? childrenNodes.map((componentId) => (
              <ComponentRender
                key={componentId}
                componentId={componentId}
                componentMap={componentMap}
              />
            ))
          : children
      }
    />
  );
}
