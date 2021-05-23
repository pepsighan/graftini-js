import { ComponentMap } from '@graftini/graft';
import components from 'canvasComponents';

type ComponentRenderProps = {
  componentId: string;
  componentMap: ComponentMap;
};

export default function ComponentRender({ componentId, componentMap }: ComponentRenderProps) {
  const { type, props, isCanvas, childrenNodes } = componentMap[componentId];
  const Component = components[type];

  const { children, ...rest } = props;

  return (
    <Component.Render
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
