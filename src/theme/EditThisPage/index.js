import React from 'react';
import Link from '@docusaurus/Link';
import {ThemeClassNames} from '@docusaurus/theme-common';
import IconEdit from '@theme/Icon/Edit';

export default function EditThisPage({editUrl}) {
  return (
    <Link to={editUrl} className={ThemeClassNames.common.editThisPage}>
      <IconEdit />
      Signal an error
    </Link>
  );
}
