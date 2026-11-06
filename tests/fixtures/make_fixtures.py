#!/usr/bin/env python3
"""Generate synthetic, non-confidential PDF fixtures for QPDF's tests.

Usage: python3 tests/fixtures/make_fixtures.py [out_dir] [--large]

Requires: reportlab, pypdf, Pillow; pyhanko (optional, for signed.pdf).
--large also writes ~25, ~50 and ~100 MB image-heavy PDFs.
"""
import io
import os
import random
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont
from pypdf import PdfReader, PdfWriter
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

OUT = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("--") else os.path.join(os.path.dirname(__file__), "out")
LARGE = "--large" in sys.argv
os.makedirs(OUT, exist_ok=True)
random.seed(42)
W, H = LETTER
LOREM = (
    "This is a synthetic test document created for QPDF. It contains no personal or confidential "
    "information. The quick brown fox jumps over the lazy dog. "
)


def p(name):
    return os.path.join(OUT, name)


def text_pdf(path, pages=3, title="QPDF Test Document", secret=False, links=True, outline=True):
    c = canvas.Canvas(path, pagesize=LETTER)
    c.setTitle(title)
    c.setAuthor("Jane Testperson")
    c.setSubject("Synthetic fixture")
    c.setCreator("QPDF fixture generator")
    for i in range(1, pages + 1):
        c.setFont("Helvetica-Bold", 20)
        c.drawString(72, H - 90, f"{title} - page {i}")
        if outline:
            c.bookmarkPage(f"p{i}")
            c.addOutlineEntry(f"Section {i}", f"p{i}", level=0)
        c.setFont("Helvetica", 11)
        y = H - 130
        for line in range(28):
            c.drawString(72, y, (LOREM * 2)[line * 3 % 60: line * 3 % 60 + 90])
            y -= 18
        if secret and i == 1:
            c.setFont("Helvetica-Bold", 14)
            c.drawString(72, 150, "Client account number: SECRET-12345")
        if links:
            c.setFont("Helvetica", 11)
            c.drawString(72, 110, "Visit https://example.org for more information.")
            c.linkURL("https://example.org", (72, 105, 330, 122), relative=0)
        c.showPage()
    c.save()


def noise_photo(w, h, seed):
    rnd = random.Random(seed)
    img = Image.new("RGB", (w // 8, h // 8))
    px = img.load()
    for y in range(img.height):
        for x in range(img.width):
            px[x, y] = (rnd.randint(40, 230), rnd.randint(40, 230), rnd.randint(40, 230))
    img = img.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(2))
    d = ImageDraw.Draw(img)
    for _ in range(30):
        x, y = rnd.randint(0, w), rnd.randint(0, h)
        d.ellipse((x, y, x + rnd.randint(50, 400), y + rnd.randint(50, 400)), outline=(255, 255, 255), width=6)
    return img


def image_pdf(path, pages=4, size=(2400, 1800), quality=95, seed=1):
    c = canvas.Canvas(path, pagesize=LETTER)
    for i in range(pages):
        img = noise_photo(*size, seed + i)
        buf = io.BytesIO()
        img.save(buf, "JPEG", quality=quality)
        buf.seek(0)
        c.drawImage(ImageReader(buf), 36, 160, W - 72, (W - 72) * size[1] / size[0])
        c.setFont("Helvetica", 12)
        c.drawString(72, 110, f"Image-heavy synthetic page {i + 1}")
        c.showPage()
    c.save()


def scanned_pdf(path, pages=3):
    font = ImageFont.load_default(size=34)
    c = canvas.Canvas(path, pagesize=LETTER)
    for i in range(pages):
        img = Image.new("L", (2550, 3300), 250)
        d = ImageDraw.Draw(img)
        d.text((220, 240), f"SCANNED SYNTHETIC PAGE {i + 1}", fill=20, font=ImageFont.load_default(size=60))
        for line in range(45):
            d.text((220, 400 + line * 60), "The quick brown fox jumps over the lazy dog 0123456789", fill=30, font=font)
        img = img.rotate(0.6, fillcolor=250).filter(ImageFilter.GaussianBlur(0.6))
        rnd = random.Random(i)
        px = img.load()
        for _ in range(60000):
            x, y = rnd.randrange(img.width), rnd.randrange(img.height)
            px[x, y] = rnd.randint(150, 255)
        buf = io.BytesIO()
        img.convert("RGB").save(buf, "JPEG", quality=92)
        buf.seek(0)
        c.drawImage(ImageReader(buf), 0, 0, W, H)
        c.showPage()
    c.save()


def form_pdf(path):
    c = canvas.Canvas(path, pagesize=LETTER)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(72, H - 90, "Synthetic application form")
    form = c.acroForm
    c.setFont("Helvetica", 12)
    c.drawString(72, H - 140, "Full name:")
    form.textfield(name="full_name", x=180, y=H - 152, width=300, height=20, value="")
    c.drawString(72, H - 180, "Email:")
    form.textfield(name="email", x=180, y=H - 192, width=300, height=20)
    c.drawString(72, H - 220, "I agree:")
    form.checkbox(name="agree", x=180, y=H - 228, size=16)
    c.drawString(72, H - 260, "Province:")
    form.choice(name="province", x=180, y=H - 272, width=200, height=20, options=["BC", "AB", "ON", "QC"], value="BC")
    c.showPage()
    c.save()


def redaction_audit_pdf(path):
    """One page with a synthetic secret in every place a redaction can leak.

    The band between y=400 and y=600 (PDF points from the bottom) is the area
    the E2E test marks for redaction. Inside it: searchable text, a scanned
    image with text in its pixels, an invisible OCR text layer, text hidden
    under a drawn black box, an overlapping vector shape and a FreeText
    annotation. Outside it: control text that must survive, a sticky note,
    a bookmark, two attachments and document properties that repeat secrets.
    """
    from pypdf.generic import DictionaryObject, NameObject, NumberObject, TextStringObject, ArrayObject, FloatObject

    tmp = path + ".tmp"
    c = canvas.Canvas(tmp, pagesize=LETTER)
    c.setTitle("Audit SECRET-TEXT-111")
    c.setSubject("SECRET-OCR-333")
    c.setAuthor("Jane Testperson")
    c.setFont("Helvetica-Bold", 18)
    c.drawString(72, 720, "Redaction Audit Fixture")
    c.setFont("Helvetica", 12)
    c.drawString(72, 680, "KEEP-THIS-TEXT visible control line")
    # 1. searchable text (with an overlapping vector shape)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(72, 570, "Account: SECRET-TEXT-111")
    c.setFillColorRGB(0.2, 0.4, 0.9)
    c.rect(300, 560, 200, 30, stroke=0, fill=1)
    c.setFillColorRGB(0, 0, 0)
    # 2. scanned image with text in its pixels + 3. invisible OCR layer
    img = Image.new("L", (1400, 360), 245)
    ImageDraw.Draw(img).text((40, 120), "SECRET-IMG-222", fill=10, font=ImageFont.load_default(size=110))
    buf = io.BytesIO()
    img.convert("RGB").save(buf, "JPEG", quality=90)
    buf.seek(0)
    c.drawImage(ImageReader(buf), 72, 430, 468, 120)
    t = c.beginText(90, 480)
    t.setTextRenderMode(3)
    t.setFont("Helvetica", 30)
    t.textLine("SECRET-OCR-333")
    c.drawText(t)
    # 4. text that was only covered by a drawn black box (fake redaction)
    c.setFont("Helvetica", 12)
    c.drawString(72, 410, "SECRET-UNDER-BOX-777")
    c.rect(68, 405, 160, 18, stroke=0, fill=1)
    # control text below the band
    c.drawString(72, 300, "KEEP-BELOW-TEXT control line")
    c.bookmarkPage("secret")
    c.bookmarkPage("clean")
    c.addOutlineEntry("Section about SECRET-TEXT-111", "secret", level=0)
    c.addOutlineEntry("Clean section", "clean", level=0)
    c.showPage()
    c.save()

    w = PdfWriter(clone_from=PdfReader(tmp))
    os.remove(tmp)
    page = w.pages[0]

    def annot(subtype, rect, contents, extra=None):
        d = DictionaryObject({
            NameObject("/Type"): NameObject("/Annot"),
            NameObject("/Subtype"): NameObject(subtype),
            NameObject("/Rect"): ArrayObject([FloatObject(v) for v in rect]),
            NameObject("/Contents"): TextStringObject(contents),
            NameObject("/F"): NumberObject(4),
        })
        for k, v in (extra or {}).items():
            d[NameObject(k)] = v
        w.add_annotation(page, d)

    annot("/FreeText", [320, 500, 520, 530], "ANNOT-IN-AREA-555", {"/DA": TextStringObject("/Helv 12 Tf 0 g")})
    annot("/Text", [520, 100, 540, 120], "Reviewer note mentions SECRET-TEXT-111")
    w.add_attachment("notes.txt", b"Attachment that repeats SECRET-TEXT-111\n")
    w.add_attachment("other.txt", b"Unrelated attachment ATTACH-OTHER-666\n")
    with open(path, "wb") as f:
        w.write(f)


def encrypt(src, dst, password="test-pass-123"):
    r = PdfReader(src)
    w = PdfWriter(clone_from=r)
    w.encrypt(user_password=password, owner_password=password + "-owner", algorithm="AES-256")
    with open(dst, "wb") as f:
        w.write(f)


def sign(src, dst):
    try:
        from cryptography import x509
        from cryptography.hazmat.primitives import hashes, serialization
        from cryptography.hazmat.primitives.asymmetric import rsa
        from cryptography.x509.oid import NameOID
        import datetime
        from pyhanko.sign import signers
        from pyhanko.pdf_utils.incremental_writer import IncrementalPdfFileWriter
    except ImportError:
        print("pyhanko not installed: skipping signed.pdf")
        return
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "QPDF Test Signer")])
    now = datetime.datetime.now(datetime.timezone.utc)
    cert = (
        x509.CertificateBuilder().subject_name(name).issuer_name(name).public_key(key.public_key())
        .serial_number(x509.random_serial_number()).not_valid_before(now)
        .not_valid_after(now + datetime.timedelta(days=365)).sign(key, hashes.SHA256())
    )
    kp, cp = p("test-signer.key.pem"), p("test-signer.cert.pem")
    with open(kp, "wb") as f:
        f.write(key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()))
    with open(cp, "wb") as f:
        f.write(cert.public_bytes(serialization.Encoding.PEM))
    signer = signers.SimpleSigner.load(kp, cp)
    with open(src, "rb") as inf:
        w = IncrementalPdfFileWriter(inf)
        meta = signers.PdfSignatureMetadata(field_name="Signature1")
        with open(dst, "wb") as outf:
            signers.sign_pdf(w, meta, signer=signer, output=outf)


def jpgs():
    for i in range(3):
        noise_photo(1600, 1200, 100 + i).save(p(f"photo-{i + 1}.jpg"), "JPEG", quality=90)


def large(target_mb, name):
    # Random-noise JPEGs compress poorly, so a few pages reach the target size.
    c = canvas.Canvas(p(name), pagesize=LETTER)
    total = 0
    i = 0
    while total < target_mb * 1024 * 1024:
        rnd = random.Random(1000 + i)
        img = Image.frombytes("RGB", (2000, 1500), bytes(rnd.getrandbits(8) for _ in range(2000 * 1500 * 3)))
        buf = io.BytesIO()
        img.save(buf, "JPEG", quality=95)
        total += buf.tell()
        buf.seek(0)
        c.drawImage(ImageReader(buf), 36, 160, W - 72, (W - 72) * 0.75)
        c.drawString(72, 110, f"Large-file synthetic page {i + 1}")
        c.showPage()
        i += 1
    c.save()


def metadata_rich_pdf(src, path):
    """Synthetic markers in every metadata location Remove PDF Metadata targets.

    Info dictionary (META-INFO-900), document-level XMP (XMP-DOC-901), catalog
    PieceInfo (PIECE-INFO-902) and a trailer /ID, plus page-level XMP
    (XMP-PAGE-903), which the tool is documented NOT to remove.
    """
    from pypdf.generic import ArrayObject, ByteStringObject, DecodedStreamObject, DictionaryObject, NameObject, TextStringObject

    def xmp(marker):
        s = DecodedStreamObject()
        s.set_data(('<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/">'
                    '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" '
                    f'xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:creator>{marker}</dc:creator></rdf:Description>'
                    '</rdf:RDF></x:xmpmeta><?xpacket end="w"?>').encode())
        s.update({NameObject("/Type"): NameObject("/Metadata"), NameObject("/Subtype"): NameObject("/XML")})
        return s

    w = PdfWriter(clone_from=src)
    w.add_metadata({"/Author": "META-INFO-900", "/Title": "META-INFO-900 title", "/Producer": "META-INFO-900 producer"})
    w._root_object[NameObject("/Metadata")] = w._add_object(xmp("XMP-DOC-901"))
    w._root_object[NameObject("/PieceInfo")] = DictionaryObject({
        NameObject("/QPDFTest"): DictionaryObject({NameObject("/Private"): TextStringObject("PIECE-INFO-902")})})
    w.pages[0][NameObject("/Metadata")] = w._add_object(xmp("XMP-PAGE-903"))
    w._ID = ArrayObject([ByteStringObject(b"ID-MARKER-904-AAAA"), ByteStringObject(b"ID-MARKER-904-BBBB")])
    with open(path, "wb") as f:
        w.write(f)


if __name__ == "__main__":
    text_pdf(p("text.pdf"))
    text_pdf(p("text-b.pdf"), pages=2, title="Second Test Document")
    text_pdf(p("redaction.pdf"), pages=2, title="Redaction Test", secret=True)
    redaction_audit_pdf(p("redaction-audit.pdf"))
    metadata_rich_pdf(p("text.pdf"), p("metadata-rich.pdf"))
    text_pdf(p("multipage-40.pdf"), pages=40, title="Forty Page Document")
    image_pdf(p("image-heavy.pdf"))
    scanned_pdf(p("scanned.pdf"))
    form_pdf(p("form.pdf"))
    encrypt(p("text.pdf"), p("encrypted.pdf"))
    sign(p("text.pdf"), p("signed.pdf"))
    jpgs()
    if LARGE:
        for mb in (25, 50, 100):
            large(mb, f"large-{mb}mb.pdf")
    for f in sorted(os.listdir(OUT)):
        print(f"{os.path.getsize(p(f)):>12,}  {f}")
