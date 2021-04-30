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

  const { children, ...rest } = component.props;

  // If the component has an explicit children prop defined, then use it (for ex: in Button).
  // TODO: Move the implementation of Button from explicit children to the one where it is a
  // canvas.
  let resolvedChildren = children;
  if (!children && component.nodes.length > 0) {
    // Do not create children if there are no nodes. The renderer needlessly passes
    // an empty array, which can make some components think that a children exists
    // (for ex: Text).
    resolvedChildren = component.nodes.map((node) => (
      <Render key={node} componentId={node} markup={markup} />
    ));
  }

  return <Component.Render {...rest} children={resolvedChildren} />;
}
