// Adds a small document icon (PDF for PDFs, a matching one for other types) next
// to every file name in the upload lists, on every tool page. Tool pages build
// their file cards themselves, so this watches the page and decorates the cards
// as they appear instead of changing each tool.

const ICONS: Array<[RegExp, string]> = [
  [/\.pdf$/i, 'ph-file-pdf'],
  [/\.(docx?|rtf|odt|pages|wps|wpd)$/i, 'ph-file-doc'],
  [/\.(xlsx?|ods)$/i, 'ph-file-xls'],
  [/\.csv$/i, 'ph-file-csv'],
  [/\.(pptx?|odp|key)$/i, 'ph-file-ppt'],
  [/\.(jpe?g|png|webp|gif|bmp|tiff?|svg|heic|avif|psd)$/i, 'ph-file-image'],
  [/\.(zip|cbz)$/i, 'ph-file-zip'],
  [/\.(txt|md|markdown|json|xml|html?|eml|msg)$/i, 'ph-file-text'],
];

export function iconForFileName(name: string): string {
  return ICONS.find(([re]) => re.test(name.trim()))?.[1] ?? 'ph-file';
}

const NAME_SELECTOR = '.truncate';
const DONE = 'data-qp-file-icon';

function decorate(nameEl: Element): void {
  const text = nameEl.textContent?.trim() ?? '';
  // Only decorate things that look like file names; skip headings and labels.
  if (!text || !/\.[a-z0-9]{2,5}$/i.test(text)) return;

  // Two layouts exist: the name sits in a column (name + size line) inside the
  // row, or the name is a direct item of the row itself (merge list).
  let info: HTMLElement | null = nameEl.parentElement;
  if (!info) return;
  let row: HTMLElement | null = info;
  if (getComputedStyle(info).flexDirection === 'column' || getComputedStyle(info).display !== 'flex') {
    row = info.parentElement;
  } else {
    info = nameEl as HTMLElement;
  }
  if (!row) return;
  // Some tools draw their own generic file glyph; ours replaces it.
  row.querySelectorAll(':scope > svg[class*="lucide-file"], :scope > [data-lucide^="file"]').forEach((n) => n.remove());
  if (row.hasAttribute(DONE)) return;
  // Pages that already show a file icon (including Compress PDF) are left alone.
  if (row.querySelector('.qp-file-ico, [data-qp-file-icon-own]')) {
    row.setAttribute(DONE, '');
    return;
  }
  if (getComputedStyle(row).display !== 'flex') return;

  const ico = document.createElement('span');
  ico.className = 'qp-file-ico';
  ico.setAttribute('aria-hidden', 'true');
  const i = document.createElement('i');
  i.className = `ph ${iconForFileName(text)}`;
  ico.append(i);
  row.setAttribute(DONE, '');
  row.insertBefore(ico, info);
  row.classList.add('gap-3');
  // Keep the name taking the free space so buttons stay on the right.
  info.style.flex = '1 1 0%';
  info.style.minWidth = '0';
}

function scan(root: ParentNode): void {
  root.querySelectorAll(NAME_SELECTOR).forEach(decorate);
}

export function initFileIcons(): void {
  let queued = false;
  const run = () => {
    queued = false;
    scan(document);
  };
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(run);
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
  scan(document);
}
