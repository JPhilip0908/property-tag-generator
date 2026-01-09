"use strict";

import { propertyTagCSS, buildTag, qrTagCSS, menuBar, script, buildQRTag } from "./modules/html-content.js";
let wbData = null;
let currentData = null;
let table = null;
const btnLogo = $("#logoUpload");
const btnDownload = $("#downloadTemplate");
const btnUpload = $("#xlsxUpload");
const btnGenerate = $("#generatePropertyTag");
const dataTable = $("#dataTable");
const btnGenerateQR = $("#generateQRTag");
let logoDataURL = null;
let logoPreview = $("#logoPreview");
const columns = ["Property Number", "Asset Item", "Manufacturer", "Model", "Serial Number", "Cost of Acquisition", "Date of Acquisition", "Date Issued", "Name of Accountable Officer", "Asset Location", "Current Condition"];
let headers = [];

table = dataTable.DataTable({
  data: [],
  columns: [
    {
      data: null,
      orderable: false,
      searchable: false,
      render: function (data, type, row, meta) {
        return '<input type="checkbox" class="row-checkbox" data-rowid="' + row.__rowId + '">';
      },
    },
  ],
  order: [],
  pageLength: 10,
  lengthMenu: [
    [10, 25, 50, 100, 250, 500, 1000],
    [10, 25, 50, 100, 250, 500, 1000],
  ],
  language: {
    emptyTable: "No data loaded. Upload the file first to populate the table.",
  },
});

//upload logo
btnLogo.on("change", function (event) {
  event.preventDefault();
  const file = event.target.files && event.target.files[0];
  if (!file) {
    logoPreview.text("Logo");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    logoDataURL = e.target.result;
    const img = new Image();
    img.onload = function () {
      logoPreview.text("");
      logoPreview.append(img);
    };
    img.src = logoDataURL;
  };
  reader.readAsDataURL(file);
});

//upload excel file
btnUpload.on("change", function (event) {
  event.preventDefault();
  const file = event.target.files && event.target.files[0];

  if (!file) return;
  if (!file.name.match(/\.xlsx$/i)) {
    Swal.fire("Error", "Please upload an .xlsx file (Excel workbook).", "error");
    event.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = e.target.result;
    try {
      const workBook = XLSX.read(data, { type: "binary" });
      wbData = workBook;
      const sheet = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[sheet];
      const json = XLSX.utils.sheet_to_json(workSheet, {
        defval: "",
        raw: false,
        range: 0,
      });

      if (json.length === 0) {
        Swal.fire("Error", "The first sheet contains no data", "error");
        return;
      }

      const filteredJSON = json.map((row) => {
        const filtered = {};
        columns.forEach((col) => {
          filtered[col] = row[col] || "";
        });
        return filtered;
      });

      const cols = [
        {
          data: null,
          orderable: false,
          searchable: false,
          render: function (data, type, row, meta) {
            return '<input type="checkbox" class="row-checkbox" data-rowid="' + row.__rowId + '">';
          },
        },
      ];

      headers = columns;

      currentData = json.map((r, idx) => {
        const clone = Object.assign({}, r);
        clone.__rowId = "r" + (idx + 1) + "_" + Date.now();
        return clone;
      });

      headers.forEach((data) => {
        cols.push({
          title: data,
          data: data,
          defaultContent: "",
        });
      });

      if ($.fn.dataTable.isDataTable("#dataTable")) {
        table.destroy();
        dataTable.empty();
        dataTable.append('<thead><tr id="tableHeadRow"><th style = "width: 40px"><input type="checkbox" id="selectAll"/></th></tr></thead>');
        const headRow = $("#tableHeadRow");
        columns.forEach((data) => headRow.append(`<th>${data}</th>`));
        dataTable.append("<tbody></tbody>");
        $("#selectAll").on("change", toggleSelectAll);
        $("#dataTable tbody").on("change", "input.row-checkbox", delegateCheckBox);
      }

      const propertyNumberIndex = columns.indexOf("Property Number");
      table = $("#dataTable").DataTable({
        data: currentData,
        columns: cols.map((col, idx) => {
          // idx-1 because first column is checkbox column
          return Object.assign({}, col, { className: "no-wrap" });

          //  return col;
        }),
        order: [],
        pageLength: 10,
        lengthMenu: [
          [10, 25, 50, 100, 250, 500, 1000],
          [10, 25, 50, 100, 250, 500, 1000],
        ],
        scrollX: true,
        autoWidth: false,
      });

      updateSelectedCount();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };
  reader.readAsArrayBuffer(file);
});

btnDownload.on("click", function (event) {
  event.preventDefault();
  //path of the template
  const filePath = "./assets/template/template.xlsx";

  const link = $("<a>").prop({
    href: filePath,
    download: "template.xlsx",
  });
  $("body").append(link);
  link[0].click();
  link.remove();
});

//generate property tag
btnGenerate.on("click", function (event) {
  event.preventDefault();
  const data = {
    school: $.trim($("#schoolName").val()),
    validator: $.trim($("#validatorName").val()),
    position: $.trim($("#position").val()),
    logo: logoDataURL,
  };

  if (Object.values(data).some((v) => !v)) {
    Swal.fire("Error", "Please fill out all required fields before proceeding.", "error");
    return;
  }

  const selectedCheckboxes = $("#dataTable tbody input.row-checkbox:checked");

  if (selectedCheckboxes.length < 6) {
    Swal.fire("Error", "Please select at least 6 rows to generate property tags", "error");
    return;
  }

  openTagsWindow(data, headers, getSelectedRows(selectedCheckboxes));
});

function openTagsWindow(data, columns, rows) {
  const pageSettings = getPageSettings();
  console.log(pageSettings);
  const width = pageSettings.width;
  const height = pageSettings.height;
  const orientation = pageSettings.orientation;

  //tag size in cm
  const tagWidth = 9.4;
  const tagHeight = 8;

  const gap = 0.3;
  const marginTop = 0.4;
  const marginSide = 0.1;
  const pageWidthInCm = width * 2.54;
  const pageHeightInCm = height * 2.54;

  const usableW = pageWidthInCm - marginSide * 2;
  const usableH = pageHeightInCm - marginTop * 2;
  const cols = Math.max(1, Math.floor((usableW + gap) / (tagWidth + gap)));
  const rowsPerPage = Math.max(1, Math.floor((usableH + gap) / (tagHeight + gap)));

  const win = window.open("", "_blank");
  if (!win) {
    Swal.fire("Error", "Popup blocked. Please allow popups for this site.", "error");
    return;
  }
  const style = propertyTagCSS(gap, marginTop, marginSide, cols, rowsPerPage);

  const esc = (v) => (!v ? "" : String(v).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])));

  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Property Tag Preview</title>${style}</head><body>`;
  html += menuBar(rows.length);
  html += `<div class="pages">`;
  for (let i = 0; i < rows.length; i += cols * rowsPerPage) {
    const slice = rows.slice(i, i + cols * rowsPerPage);
    html += `<div class = "page">${slice.map(buildTag(data, esc)).join("")}</div>`;
  }
  html += `</div>`;
  html += script(width, height, orientation, rowsPerPage);
  html += `</body></html>`;
  win.document.open();
  win.document.writeln(html);
  win.document.close();
}
$("#pageSize").on("change", function (event) {
  event.preventDefault();
  const isCustom = $(this).val() === "custom";
  $("#customSizeInputs").css("display", isCustom ? "inline-flex" : "none");
});

function getPageSettings() {
  const size = $("#pageSize").val();
  const orientation = $("#pageOrientation").val();
  let width = 8.27;
  let height = 11.69;

  if (size === "letter") {
    width = 8.5;
    height = 11;
  } else if (size === "folio") {
    width = 8.5;
    height = 13;
  } else if (size === "custom") {
    width = parseFloat($("#customWidth").val());
    height = parseFloat($("#customHeight").val());
    return { width, height, unit: "in", orientation };
  }

  if (orientation === "landscape") [width, height] = [height, width];
  return { width, height, unit: "in", orientation };
}

//update selected count
function updateSelectedCount() {
  const count = $("#dataTable tbody input.row-checkbox:checked").length;
  $("#selectedCount").text(count + " selected");
}

function delegateCheckBox() {
  updateSelectedCount();
  //uncheck header select checkboxes if none were checked
  const all = $("#dataTable tbody input.row-checkbox").length;
  const checked = $("#dataTable tbody input.row-checkbox:checked").length;
  $("#selectAll").prop("checked", all > 0 && all === checked);
}

//select all rows when checked
function toggleSelectAll(event) {
  const checked = $(this).is(":checked");
  $("#dataTable tbody input.row-checkbox").prop("checked", checked).trigger("change");
}

btnGenerateQR.on("click", function (event) {
  event.preventDefault();
  const selectedCheckboxes = $("#dataTable tbody input.row-checkbox:checked");

  if (selectedCheckboxes.length === 0) {
    Swal.fire("Error", "Please select at least one row to generate QR tags.", "error");
    return;
  }

  const data = {
    school: $.trim($("#schoolName").val()),
    validator: $.trim($("#validatorName").val()),
    position: $.trim($("#position").val()),
    logo: logoDataURL,
  };

  generateQRCodes(data, getSelectedRows(selectedCheckboxes));
});

async function generateQRCodes(data, rows) {
  if (Object.values(data).some((v) => !v)) {
    Swal.fire("Error", "Please fill out all required fields before proceeding.", "error");
    return;
  }
  const pageSettings = getPageSettings();
  const w = window.open("", "_blank");
  if (!w) {
    Swal.fire("Error", "Popup blocked. Allow popups for this site.", "error");
    return;
  }

  const tagWidth = 1.37;
  const tagHeight = 1.77;
  const width = (tagWidth * 2.54).toFixed(4);
  const height = (tagHeight * 2.54).toFixed(4);
  const gap = 0.15;
  const margin = 0.3;

  const pageWidthInCm = pageSettings.width * 2.54;
  const pageHeightInCm = pageSettings.height * 2.54;

  const usableW = pageWidthInCm - margin * 2;
  const usableH = pageHeightInCm - margin * 2;
  const cols = Math.max(1, Math.floor((usableW + gap) / (parseFloat(width) + gap)));
  const rowsPerPage = Math.max(1, Math.floor((usableH + gap) / (parseFloat(height) + gap)));

  const rowsJson = JSON.stringify(rows).replace(/</g, "\\u003c");
  const headerJson = JSON.stringify(data).replace(/</g, "\\u003c");

  const html = buildQRTag(qrTagCSS(width, height, margin, gap, cols, rowsPerPage), rowsJson, headerJson, rows.length, pageSettings, cols, rowsPerPage);
  w.document.open();
  w.document.writeln(html);
  w.document.close();
}

function getSelectedRows(selectedCheckboxes) {
  const selectedRows = selectedCheckboxes
    .map(function () {
      const rowId = $(this).data("rowid");
      return currentData.find((r) => r.__rowId === rowId);
    })
    .get()
    .filter(Boolean);
  return selectedRows;
}
