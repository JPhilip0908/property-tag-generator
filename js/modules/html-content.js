export const propertyTagCSS = function (gap, marginTop, marginSide, cols) {
  return `
  <style>
    :root {
      --tag-w: 10cm;
      --tag-h: 8cm;
    }
    html, body {
      margin: 0;
      padding: 0;
      font-family: Arial, Helvetica, sans-serif;
      background: #fff;
    }
    .toolbar {
      display: flex;
      gap: 10px;
      padding: 10px;
      border-bottom: 1px solid #ccc;
      background: #f7f7f7;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    button {
      padding: 6px 12px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
    }
    button#print { background: #2b6cb0; color: #fff; }
    button#download { background: #4a5568; color: #fff; }

    .pages {
      padding: ${marginTop}cm ${marginSide}cm;
      display: flex;
      flex-direction: column;
      gap: ${gap}cm;
    }
    .page {
      display: grid;
      grid-template-columns: repeat(${cols}, var(--tag-w));
      grid-auto-rows: var(--tag-h);
      gap: ${gap}cm;
      page-break-after: always;
      justify-content: center;
    }

    /* ===== PROPERTY TAG TEMPLATE ===== */
    .property-tag {
      width: var(--tag-w);
      height: var(--tag-h);
      border: 3px solid #000;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      page-break-inside: avoid;
    }
    .top {
      display: flex;
      border-bottom: 1px solid #000;
      height: 3.8cm;
    }
    .logo {
      width: 1.5cm;
      height: 3cm;
      border-right: 1px solid #000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2px 2px;
    }
    .logo img {
      width: 1.5cm;
      height: 1.5cm;
      object-fit: contain;
      margin-bottom: 4px;
    }
    .logo-text {
      font-size: 7pt;
      text-align: center;
      line-height: 1.05;
    }
    .desc-container {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .desc-box {
      padding: 3px 6px; /* ⬅ tighter top/left */
      border-bottom: 1px solid #000;
      flex: 1.6;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .desc-label {
      font-weight: 700;
      font-size: 7pt;
      text-align: left;
      margin-bottom: 2px; /* ⬅ smaller spacing */
    }

    .desc-content {
      font-weight: 700;
      font-size: 9pt;
      text-transform: uppercase;
      text-align: center;
      line-height: 1.1;
      overflow-wrap: break-word;
      word-break: break-word;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: 0.9fr 1.8fr;
      grid-template-rows: 1fr 1fr;
    }
    .grid-cell { padding: 3px 8px; }
    .grid-cell.col-right { border-left: 1px solid #000; }
    .grid-cell.row-bottom { border-top: 1px solid #000; }
    .label { font-weight: bold; font-size: 7pt; }

    /* font shrink only for model number (do not stretch width) */
    .data {
      font-weight: 700;
      font-size: 8.5pt;
      margin-top: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.05;
    }

    .property-number {
      text-align: center;
      font-weight: 700;
      font-size: 10pt;
      border-bottom: 1px solid #000;
      padding: 6px 0;
    }
    .person {
      text-align: center;
      font-weight: 700;
      font-size: 9pt;
      border-bottom: 1px solid #000;
      padding: 6px 0;
    }
    .date-issued {
      font-size: 7pt;
      padding: 6px 8px 8px 0px;
      border-bottom: 1px solid #000;
      text-align: left;
    }
    .validated {
      text-align: center;
      font-size: 7pt;
      padding: 6px 8px;
      border-bottom: 1px solid #000;
    }
    .validated .name { font-weight: 700; font-size: 8pt; }
    .validated .position { font-size: 7.5pt; }
    .footer {
      text-align: center;
      font-weight: 700;
      font-size: 10pt;
      border-top: 1px solid #000;
      padding: 6px 0;
    }

    @media print {
      .toolbar { display: none !important; }
      body { margin: 0; }
    }
  </style>`;
};

export const qrTagCSS = function (width, height, margin, gap) {
  return `
    <style>
      html,body{margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#fff}
      .toolbar{display:flex;gap:10px;padding:10px;background:#f7f7f7;border-bottom:1px solid #ccc;position:sticky;top:0;z-index:10}
      button{padding:6px 12px;border-radius:6px;border:0;cursor:pointer;font-weight:600}
      button#print{background:#2b6cb0;color:#fff} button#download{background:#4a5568;color:#fff}
      .pages{padding:${margin}cm;display:flex;flex-wrap:wrap;gap:${gap}cm;justify-content:center}
      .qr-tag{width:${width}cm;height:${height}cm;border:1px solid #000;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2px;overflow:hidden}
      canvas.qr{width:calc(${width}cm - 0.3cm);height:calc(${width}cm - 0.3cm);object-fit:contain}
      .property-number{font-size:6pt;text-align:center;margin-top:2px;word-break:break-word}
      @media print { .toolbar{display:none!important} body{margin:0} }
    </style>
  `;
};

export const buildTag = function (data, esc) {
  return (r) => `
  <div class="property-tag">
    <div class="top">
      <div class="logo">
        ${data.logo ? `<img src="${data.logo}" alt="Logo">` : ""}
        <div class="logo-text">DepEd - ${esc(data.school)}</div>
      </div>
      <div class="desc-container">
        <div class="desc-box">
          <div class="desc-label">Description of the property</div>
          <div class="desc-content">${esc(r["Description for Property Tag"] || "")}</div>
        </div>
        <div class="meta-grid">
          <div class="grid-cell">
            <div class="label">Model Number</div>
            <div class="data shrinkable model-cell">${esc(r["Model"] || "")}</div>
          </div>
          <div class="grid-cell col-right">
            <div class="label">Serial Number</div>
            <div class="data">${esc(r["Serial Number"] || r["Serial"] || "")}</div>
          </div>
          <div class="grid-cell row-bottom">
            <div class="label">Date Acquired</div>
            <div class="data">${esc(r["Date of Acquisition"] || "")}</div>
          </div>
          <div class="grid-cell col-right row-bottom">
            <div class="label">Acquisition Cost</div>
            <div class="data">Php ${esc(r["Cost of Acquisition"] || "")}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="label" style="padding-left: 1px;">Property Number</div>
    <div class="property-number">${esc(r["Property Number"] || "")}</div>

    <div class="label" style="padding-left: 1px;">Person Accountable</div>
    <div class="person">${esc(r["Name of Accountable Officer"] || "")}</div>

    <div class="date-issued label" style="padding-left: 1px;">Date Issued: <span>${esc(r["Date Issued"] || "")}</span></div>

    <div class="label" style="padding-left: 1px;">Validated by:</div>
    <div class="validated" style="padding-left: 1px;">
      <div class="name">${esc(data.validator)}</div>
      <div class="position">${esc(data.position)}</div>
    </div>

    <div class="footer">TAMPERING OF THIS LABEL IS PROHIBITED</div>
  </div>`;
};

export const menuBar = function (length) {
  return `
  <div class="toolbar">
    <button id="print">Print</button>
    <button id="download">Download PDF</button>
    <span style="margin-left:auto;">Total Tags: ${length}</span>
  </div>`;
};

export const script = function (width, height, orientation) {
  return `<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <script>
    // shrink model text only (never expand box)
    function shrinkIfOverflow(el, minPt = 6, step = 0.2) {
      const parentW = el.parentElement.clientWidth - 2;
      let cs = window.getComputedStyle(el);
      let fontSize = parseFloat(cs.fontSize);
      const minPx = (minPt * 96) / 72;
      while (el.scrollWidth > parentW && fontSize > minPx) {
        fontSize -= step;
        el.style.fontSize = fontSize + 'px';
      }
    }
    function applySmartShrink() {
      document.querySelectorAll('.model-cell').forEach(el => shrinkIfOverflow(el, 6, 0.4));
    }
    applySmartShrink();
    window.addEventListener('resize', applySmartShrink);

    document.getElementById('print').addEventListener('click',()=>window.print());
    document.getElementById('download').addEventListener('click',()=>{
      const content=document.querySelector('.pages');
      const opt={
        margin:0,
        filename:'Property_Tags.pdf',
        image:{type:'jpeg',quality:0.98},
        html2canvas:{scale:2,useCORS:true},
        jsPDF:{unit:'in',format:[${width},${height}],orientation:'${orientation}'}
      };
      html2pdf().set(opt).from(content).save();
    });
  <\/script>`;
};

export const buildQRTag = function (qrTagCSS, rowsJson, headerJson, length, pageSettings) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>QR Tags</title>${qrTagCSS}</head><body>
    <div class="toolbar">
      <button id="print">Print</button>
      <button id="download">Download PDF</button>
      <span style="margin-left:auto">Total QR Tags: ${length}</span>
    </div>
    <div class="pages" id="pages"></div>

    <!-- libs -->
    <script src="https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

    <script>
      // bring serialized data into preview scope
      const rows = ${rowsJson};
      const headerObj = ${headerJson};

      // Safe esc for HTML text nodes
      function esc(s){ if(s===null||s===undefined) return ''; return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

      // Build the textual payload encoded into the QR (plain text)
      function buildQRData(r){
        return [
          'Description: ' + (r['Asset Item']||r['Description']||''),
          'Model Number: ' + (r['Model']||''),
          'Serial Number: ' + (r['SerialNumber']||r['Serial']||''),
          'Acquisition Cost: ' + (r['Cost of Acquisition']||''),
          'Date of Acquisition: ' + (r['Date of Acquisition']||''),
          'Property Number: ' + (r['Property Number']||''),
          'Date Issued: ' + (r['Date Issued']||''),
          'Accountable Officer: ' + (r['Name of Accountable Officer']||''),
          'Validator: ' + (headerObj.validator||''),
          'Position: ' + (headerObj.position||''),
          'Current Condition: ' + (r['Current Condition']||'')
        ].join('\\n');
      }

      // Build DOM for each QR tag
      const pagesEl = document.getElementById('pages');

      rows.forEach((r, i) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'qr-tag';
        wrapper.innerHTML = '<canvas class="qr" id="qr_' + i + '"></canvas><div class="property-number" id="pn_' + i + '"></div>';
        pagesEl.appendChild(wrapper);
        document.getElementById('pn_' + i).innerText = esc(r['Property Number']||'');
      });

      // Create QR images and overlay logo
      awaitImagesAndDraw();

      function awaitImagesAndDraw(){
        // create QR for each canvas and optionally overlay logo (center)
        rows.forEach((r,i)=>{
          const canvas = document.getElementById('qr_' + i);
          const qrText = buildQRData(r);

          // create the QR into the canvas using QRious
          const qr = new QRious({
            element: canvas,
            value: qrText,
            size: 400, // start with large pixel size to preserve resolution
            level: 'H',
            background: 'white',
            foreground: 'black'
          });

          // overlay logo (if present) onto the canvas center
          if(headerObj.logo){
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = headerObj.logo;
            img.onload = () => {
              // draw at center  ---- ensure logo size fit and is passport-like but not too big
              const overlayW = Math.floor(canvas.width * 0.20); // 20% of QR
              const overlayH = Math.floor(canvas.height * 0.20);
              const x = Math.floor((canvas.width - overlayW) / 2);
              const y = Math.floor((canvas.height - overlayH) / 2);
              // draw white rounded rect behind logo to improve scan reliability
              const radius = 6;
              ctx.fillStyle = '#fff';
              roundRect(ctx, x - 4, y - 4, overlayW + 8, overlayH + 8, radius, true, false);
              ctx.drawImage(img, x, y, overlayW, overlayH);
            };
            img.onerror = ()=>{ /* ignore logo load failure */ };
          }
        });
      }

      // helper: rounded rect
      function roundRect(ctx, x, y, w, h, r, fill, stroke){
        if (typeof r === 'undefined') r = 5;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        if (fill) { ctx.fill(); }
        if (stroke) { ctx.stroke(); }
      }

      // wire print & download
      document.getElementById('print').addEventListener('click', ()=> window.print());
      document.getElementById('download').addEventListener('click', ()=>{
        const content = document.querySelector('.pages');
        const opt = {
          margin: 0,
          filename: 'QR_Tags.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: ${JSON.stringify([pageSettings.height, pageSettings.width])}, orientation: '${pageSettings.orientation}' }
        };
        // html2pdf will paginate based on jsPDF format; pages already sized to inches/cm in CSS
        html2pdf().set(opt).from(content).save();
      });
    </script>
  </body></html>`;
};
