import MDXComponents from '@theme-original/MDXComponents';
import Ent from '@site/src/components/Ent';
import CipherNote from '@site/src/components/CipherNote';

// Generated letter pages use these without importing them. Both casings are
// registered: MDX resolves capitalised tags, but if the markdown format is
// ever switched to CommonMark the HTML parser lowercases tag names.
export default {
  ...MDXComponents,
  Ent,
  ent: Ent,
  CipherNote,
  ciphernote: CipherNote,
};
