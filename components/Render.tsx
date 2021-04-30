import { SerializedNodes } from '@craftjs/core';
import components from 'canvasComponents';
import { rootComponentId } from 'store/editor';

type RenderProps = {
  componentId?: string;
  markup: SerializedNodes;
};

export default function Render({ componentId, markup }: RenderProps) {
  const id = componentId || rootComponentId;
  const component = markup[id];

  const type = typeof component.type === 'string' ? component.type : component.type.resolvedName;
  const Component = components[type];

  return (
    <Component {...component.props}>
      {component.nodes.map((node) => (
        <Render key={node} componentId={node} markup={markup} />
      ))}
    </Component>
  );
}
