export function getPages(): string[] {
  const pagesString = localStorage.getItem('pages');
  return pagesString ? JSON.parse(pagesString) : [];
}

export function addPage(name: string) {
  const pages = getPages();
  pages.push(name);
  localStorage.setItem('pages', JSON.stringify(pages));
  return pages;
}