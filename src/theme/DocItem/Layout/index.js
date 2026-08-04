import React from "react";
import Layout from "@theme-original/DocItem/Layout";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import EditionView from "@site/src/components/EditionView";
import LetterContext from "@site/src/components/LetterContext";
import { LetterDateProvider } from "@site/src/components/LetterDate";

// The reading controls belong on the letters themselves, not on every page
// of the site. Letter pages are the generated ones under docs/<year>/, and
// the transform records whether a letter carries cipher.
export default function DocItemLayoutWrapper(props) {
  const { metadata, frontMatter } = useDoc();
  const isLetter = /^\d{4}\//.test(metadata.id);
  // Letter slugs are their dates, which is steadier than the front matter,
  // where a bare `date` key can be parsed into something other than a string.
  const letterDate =
    (typeof frontMatter.date === "string" && frontMatter.date) ||
    (metadata.id.match(/(\d{4}-\d{2}-\d{2})/) || [])[1] ||
    "";

  if (!isLetter) {
    return <Layout {...props} />;
  }

  // The letter's own date travels down to the entity cards, so a man is
  // described by the office he held when this letter names him.
  return (
    <LetterDateProvider date={letterDate}>
      <EditionView />
      <LetterContext date={letterDate} />
      <Layout {...props} />
    </LetterDateProvider>
  );
}
