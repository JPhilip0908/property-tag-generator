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
