const fs = require('fs');
const path = require('path');

module.exports = function letterCountSidebarPlugin(context) {
  return {
    name: 'letter-count-sidebar',

    async loadContent() {
      const docsDir = path.join(context.siteDir, 'docs');
      const entries = fs.readdirSync(docsDir, {withFileTypes: true});
      const counts = {};

      for (const entry of entries) {
        if (entry.isDirectory() && /^\d{4}$/.test(entry.name)) {
          const yearDir = path.join(docsDir, entry.name);
          const files = fs.readdirSync(yearDir);
          const mdCount = files.filter(
            (f) => f.endsWith('.md') || f.endsWith('.mdx'),
          ).length;
          counts[entry.name] = mdCount;
        }
      }

      // Write _category_.json for each year folder
      for (const [year, count] of Object.entries(counts)) {
        const categoryPath = path.join(docsDir, year, '_category_.json');
        const categoryData = {
          label: `${year} (${count})`,
          position: parseInt(year, 10) - 1567, // chronological order
        };
        fs.writeFileSync(categoryPath, JSON.stringify(categoryData, null, 2) + '\n');
      }

      return counts;
    },
  };
};
