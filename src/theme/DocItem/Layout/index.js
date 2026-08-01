import React from 'react';
import Layout from '@theme-original/DocItem/Layout';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import EditionView from '@site/src/components/EditionView';

// The reading controls belong on the letters themselves, not on every page
// of the site. Letter pages are the generated ones under docs/<year>/, and
// the transform records whether a letter carries cipher.
export default function DocItemLayoutWrapper(props) {
  const {metadata, frontMatter} = useDoc();
  const isLetter = /^\d{4}\//.test(metadata.id);

  if (!isLetter) {
    return <Layout {...props} />;
  }

  return (
    <>
      <EditionView hasCipher={Boolean(frontMatter.hasCipher)} />
      <Layout {...props} />
    </>
  );
}
