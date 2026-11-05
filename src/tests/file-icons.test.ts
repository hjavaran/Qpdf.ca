import { describe, it, expect, beforeEach } from 'vitest';
import { iconForFileName, initFileIcons } from '../js/qpdf/file-icons';

describe('file icons', () => {
  it('picks an icon by file type, PDF for PDFs', () => {
    expect(iconForFileName('report.PDF')).toBe('ph-file-pdf');
    expect(iconForFileName('a.docx')).toBe('ph-file-doc');
    expect(iconForFileName('a.xlsx')).toBe('ph-file-xls');
    expect(iconForFileName('a.csv')).toBe('ph-file-csv');
    expect(iconForFileName('a.JPG')).toBe('ph-file-image');
    expect(iconForFileName('noext')).toBe('ph-file');
  });

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('adds one icon next to each file name, also for cards added later', async () => {
    document.body.innerHTML =
      '<div id="list"><div class="flex items-center justify-between"><div class="flex flex-col"><div class="truncate font-medium">a.pdf</div><div>1 KB</div></div><button>x</button></div></div>';
    const style = document.createElement('style');
    style.textContent = '.flex{display:flex}';
    document.head.append(style);
    initFileIcons();
    const list = document.getElementById('list')!;
    expect(list.querySelectorAll('.qp-file-ico').length).toBe(1);
    expect(list.querySelector('.qp-file-ico i')!.className).toContain('ph-file-pdf');
    list.insertAdjacentHTML(
      'beforeend',
      '<div class="flex"><div><div class="truncate font-medium">b.docx</div></div></div>'
    );
    await new Promise((r) => setTimeout(r, 50));
    expect(list.querySelectorAll('.qp-file-ico').length).toBe(2);
    await new Promise((r) => setTimeout(r, 50));
    expect(list.querySelectorAll('.qp-file-ico').length).toBe(2); // no duplicates
  });

  it('ignores headings that are not file names', () => {
    document.body.innerHTML = '<div class="flex"><div><div class="truncate font-medium">Compression level</div></div></div>';
    initFileIcons();
    expect(document.querySelector('.qp-file-ico')).toBeNull();
  });
});
