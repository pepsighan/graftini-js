import { FontSize, FontWeight, RGBA, TextAlign } from '@graftini/bricks';
import { Selection, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { MarkKind, NodeKind } from './schema';

type TextOptionsFields = {
  color?: RGBA;
  fontSize?: FontSize;
  fontFamily?: string;
  fontWeight?: FontWeight;
  textAlign?: TextAlign;
};

/**
 * The default text form values if they do not exist.
 */
export const defaultTextFormValues: TextOptionsFields = {
  color: { r: 0, g: 0, b: 0, a: 1 },
  fontFamily: 'sans-serif',
  fontSize: { size: 1, unit: 'rem' },
  fontWeight: 400,
  textAlign: 'left',
};

/**
 * Gets the current form field values from the current selection.
 */
export function getFormFieldValuesFromSelection(
  view?: EditorView | null,
  selection?: Selection | null
): TextOptionsFields {
  if (!view) {
    return defaultTextFormValues;
  }

  let textAlign: TextAlign | null = null;
  let fontFamily: string | null = null;
  let fontSize: FontSize | null = null;
  let fontWeight: FontWeight | null = null;
  let color: RGBA | null = null;

  const content = contentFromSelection(view, selection);
  content.forEach((paragraphNode) => {
    // All the node types here are paragraphs. But to be sure checking
    // it here just so that we have no surprises.
    if (paragraphNode.type.name !== NodeKind.Paragraph) {
      return;
    }

    textAlign ??= paragraphNode.attrs.textAlign;

    // Descend to each text node of the paragraph.
    paragraphNode.forEach((textNode) => {
      if (textNode.type.name !== NodeKind.Text) {
        return;
      }

      textNode.marks.forEach((mark) => {
        switch (mark.type.name) {
          case MarkKind.FontFamily:
            fontFamily ??= mark.attrs.fontFamily;
            break;
          case MarkKind.FontSize:
            fontSize ??= mark.attrs as FontSize;
            break;
          case MarkKind.FontWeight:
            fontWeight ??= mark.attrs.fontWeight;
            break;
          case MarkKind.TextColor:
            color ??= mark.attrs as RGBA;
            break;
        }
      });
    });
  });

  return {
    textAlign: textAlign ?? defaultTextFormValues.textAlign,
    fontFamily: fontFamily ?? defaultTextFormValues.fontFamily,
    fontSize: fontSize ?? defaultTextFormValues.fontSize,
    fontWeight: fontWeight ?? defaultTextFormValues.fontWeight,
    color: color ?? defaultTextFormValues.color,
  };
}

type ActionType = '' | 'pageId' | 'href';

type InteractionOptions = {
  link: {
    action: ActionType;
    pageId?: string;
    href?: string;
  };
};

/**
 * Get the form field values that define the interaction of a text.
 */
export function getInteractionFormFieldValuesFromSelection(
  view?: EditorView | null,
  selection?: Selection | null
): InteractionOptions {
  if (!view) {
    return {
      link: {
        action: '',
      },
    };
  }

  let pageId: string | undefined;
  let href: string | undefined;

  const content = contentFromSelection(view, selection);
  content.forEach((paragraphNode) => {
    // All the node types here are paragraphs. But to be sure checking
    // it here just so that we have no surprises.
    if (paragraphNode.type.name !== NodeKind.Paragraph) {
      return;
    }

    // Descend to each text node of the paragraph.
    paragraphNode.forEach((textNode) => {
      if (textNode.type.name !== NodeKind.Text) {
        return;
      }

      textNode.marks.forEach((mark) => {
        // Get the first page id or href.
        if (mark.type.name === MarkKind.Link && !pageId && !href) {
          pageId = mark.attrs.pageId;
          href = mark.attrs.href;
        }
      });
    });
  });

  let action: ActionType = '';
  if (pageId) {
    action = 'pageId';
  } else if (href) {
    action = 'href';
  }

  return {
    link: {
      action,
      pageId,
      href: !pageId ? href : undefined,
    },
  };
}

function contentFromSelection(view: EditorView, selection: Selection) {
  let content = selection.content().content;

  if (selection.empty) {
    // If the selection is empty, it won't be able to get the form values.
    // So we select the preceding character.
    const previous = TextSelection.create(
      view.state.doc,
      selection.anchor === 1 ? 1 : selection.anchor - 1,
      selection.head === 1 ? 2 : selection.head
    );
    content = previous.content().content;
  }

  return content;
}
