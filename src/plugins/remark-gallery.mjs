/**
 * Remark plugin: :::gallery directive
 *
 * Transforms markdown like:
 *   :::gallery
 *   ![Alt 1](./img1.jpg)
 *   ![Alt 2](./img2.jpg)
 *   :::
 *
 * Into an HTML structure that the Gallery component styles as a slideshow.
 */
import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

export function remarkGallery() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' &&
        node.name === 'gallery'
      ) {
        const data = node.data || (node.data = {});
        const tagName = 'div';

        data.hName = tagName;
        data.hProperties = {
          class: 'gallery',
          'data-gallery': 'true',
        };
      }
    });
  };
}
