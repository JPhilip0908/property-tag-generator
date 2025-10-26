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
      border: 2px solid #000;
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
      width: 1.8cm;
      border-right: 1px solid #000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4px 2px;
    }
    .logo img {
      width: 1.7cm;
      height: 1.7cm;
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
          <div class="desc-content">${esc(r["Asset Item"] || r["Description"] || "")}</div>
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

    <div class="label">Property Number</div>
    <div class="property-number">${esc(r["Property Number"] || "")}</div>

    <div class="label">Person Accountable</div>
    <div class="person">${esc(r["Name of Accountable Officer"] || "")}</div>

    <div class="date-issued label">Date Issued: <span>${esc(r["Date Issued"] || "")}</span></div>

    <div class="label">Validated by:</div>
    <div class="validated">
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
    <span style="margin-left:auto;">Total Tags: ${rows.length}</span>
  </div>`;
};

export const script = function (width, height) {
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
  </script>`;
};
