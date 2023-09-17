import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import presetPlugin from 'grapesjs-preset-webpage';
import blocksBasicPlugin from 'grapesjs-blocks-basic';
import exportPlugin from 'grapesjs-plugin-export';
import './styles.css';
import { addPage, getPages } from './pages';
import { hideElement, setSelectOptions, showElement } from './html';

let editor: Editor;
loadEditor();
let currentPage: string;

let pages = getPages();
pagesChanged();
if (pages.length > 0) {
  setCurrentPage(pages[0]);
}

function pagesChanged() {
  if (pages.length === 0) {
    ['gjs', 'page-select'].forEach(x => hideElement(x));
    ['no-pages'].forEach(x => showElement(x));
  } else {
    ['gjs', 'page-select'].forEach(x => showElement(x));
    ['no-pages'].forEach(x => hideElement(x));
    setSelectOptions('page-select-input', pages, currentPage);
  }
}

async function setCurrentPage(pageName: string) {
  currentPage = pageName;
  const data = await editor.load();
  editor.loadProjectData(data);
}

function loadEditor() {
  const multipleLocalStorage = (editor: Editor) => {
    editor.Storage.add('multiple-local', {
      async load() {
        const data = localStorage.getItem(currentPage);
        return JSON.parse(data || `{"assets":[],"styles":[{"selectors":["#i2uh"],"style":{"padding":"10px"}}],"pages":[{"frames":[{"component":{"type":"wrapper","stylable":["background","background-color","background-image","background-repeat","background-attachment","background-position","background-size"],"components":[{"type":"text","attributes":{"id":"i2uh"},"components":[{"type":"textnode","content":"Page ${currentPage}"}]}]},"id":"axPb4D38eV0fjesh"}],"type":"main","id":"11NzNDte1iwu5z9c"}]}`);
      },

      async store(data) {
        localStorage.setItem(currentPage, JSON.stringify(data));
      }
    });
  };

  document.getElementById('gjs')!.childNodes.forEach(c => c.remove());
  editor = grapesjs.init({
    container: '#gjs',
    plugins: [
      editor => blocksBasicPlugin(editor, { /* options */ }),
      editor => presetPlugin(editor, { /* options */ }),
      editor => exportPlugin(editor, { /* options */ }),
      editor => multipleLocalStorage(editor),
    ],
    showOffsets: true,
    noticeOnUnload: false,
    storageManager: {
      type: 'multiple-local', // Type of the storage, available: 'local' | 'remote'
      autosave: true, // Store data automatically
      autoload: true, // Autoload stored data on init
      stepsBeforeSave: 1, // If autosave enabled, indicates how many changes are necessary before store method is triggered
      options: {}
    },
    fromElement: true,
  });
}

document.getElementById("download-btn")!.onclick = function () { download() };
function download() {
  editor.runCommand('gjs-export-zip', { filename: () => currentPage });
}

document.getElementById("page-add-btn")!.onclick = function () { clickAddPage() };
function clickAddPage() {
  const input = document.getElementById('page-add-input') as HTMLInputElement;
  const pageName = input.value;
  pages = addPage(pageName);
  setCurrentPage(pageName);
  pagesChanged();
  input.value = '';
}

const select = document.getElementById('page-select-input') as HTMLSelectElement;
select.onchange = function () { pageChanged() };
function pageChanged() {
  const select = document.getElementById('page-select-input') as HTMLSelectElement;
  const pageName = select.value;
  setCurrentPage(pageName);
}