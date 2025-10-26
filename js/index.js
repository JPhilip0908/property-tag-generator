"use strict";

import { propertyTagCSS, buildTag, menuBar, script } from "./modules/html-content.js";
let wbData = null;
let currentData = null;
let table = null;
const btnLogo = $("#logoUpload");
const btnDownload = $("#downloadTemplate");
const btnUpload = $("#xlsxUpload");
const btnGenerate = $("#generatePropertyTag");
const dataTable = $("#dataTable");
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
  language: {
    emptyTable: "No data loaded. Upload an .xlsx file to populate the table.",
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
  const filePath = "template/template.xlsx";

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
    Swal.fire("Please select at least 6 rows to generate property tags");
    return;
  }

  const selectedRows = selectedCheckboxes
    .map(function () {
      const rowId = $(this).data("rowid");
      return currentData.find((r) => r.__rowId === rowId);
    })
    .get()
    .filter(Boolean);

  console.log(selectedRows);

  openTagsWindow(data, headers, selectedRows);
});

function openTagsWindow(data, columns, rows) {
  const pageSettings = getPageSettings();
  const width = pageSettings.width;
  const height = pageSettings.height;
  const orientation = pageSettings.orientation;

  //tag size in cm
  const tagWidth = 10;
  const tagHeight = 8;

  const gap = 0.3;
  const marginTop = 0.3;
  const marginSide = 0.3;
  const pageWidthInCm = width * 2.54;
  const pageHeightInCm = height * 2.54;

  const usableW = pageWidthInCm - marginSide * 2 + gap;
  const usableH = pageHeightInCm - marginTop * 2 + gap;
  const cols = Math.floor(usableW / (tagWidth + gap));
  const rowsPerPage = Math.floor(usableH / (tagHeight + gap));

  const win = window.open("", "_blank");
  if (!win) {
    Swal.fire("Error", "Popup blocked. Please allow popups for this site.", "error");
    return;
  }
  const style = propertyTagCSS(gap, marginTop, marginSide, cols);

  // escaping special characters to avoid html injection and rendering issues
  const esc = (v) => (!v ? "" : String(v).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])));

  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Property Tag Preview</title>${style}</head><body>`;
  html += menuBar(rows.length);
  html += `<div class="pages">`;
  for (let i = 0; i < rows.length; i += cols * rowsPerPage) {
    const slice = rows.slice(i, i + cols * rowsPerPage);
    html += `<div class = "page">${slice.map(buildTag(data, esc)).join("")}</div>`;
  }
  html += `</div>`;
  html += script(width, height, orientation);
  html += `</body></html>`;
  win.document.open();
  win.document.writeln(html);
  win.document.close();
}

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
  } else {
    width = parseFloat($("#customWidth").val()) || 8.27;
    height = parseFloat($("#customHeigh").val()) || 11.69;
  }

  if (orientation === "landscape") [width, height] = [height, width];
  return { width, height, unit: "in", orientation };
}
function createData(filteredJSON) {
  currentData = filteredJSON.map((row, index) => {
    const clone = Object.assign({}, row);
    clone._rowId = `r${index + 1}_${Date.now()}`;
    return clone;
  });
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
  console.log("chkSelectAll length:", $("#selectAll").length);
  console.log("type of toggleSelectAll:", typeof toggleSelectAll);
  console.log("is arrow function? try toggleSelectAll.prototype:", toggleSelectAll.prototype);
}
