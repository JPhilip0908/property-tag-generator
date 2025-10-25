"use strict";

import { defaultTable } from "./modules/table-object.js";

let wbData = null;
let currentData = null;
let table = null;
let school = $.trim($("#schoolName").val());
let validator = $.trim($("#validatorName").val());
let position = $.trim($("#position").val());
const btnLogo = $("#logoUpload");
const btnDownload = $("#downloadTemplate");
const btnUpload = $("#xlsxUpload");
const dataTable = $("#dataTable");
let logoDataURL = null;
let logoPreview = $("#logoPreview");
const columns = ["Property Number", "Asset Item", "Manufacturer", "Model", "Serial Number", "Cost of Acquisition", "Date of Acquisition", "Date Issued", "Name of Accountable Officer", "Asset Location", "Current Condition"];
let headers = [];

table = dataTable.DataTable(defaultTable());

//upload logo
btnLogo.on("change", function (event) {
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
  const file = event.target.files && event.target.files[0];

  if (!file) return;
  if (!file.name.match(/\.xlsx$/i)) {
    alert("Please upload an .xlsx file (Excel workbook).");
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
        alert("The first sheet contains no data");
        return;
      }

      const filteredJSON = json.map((row) => {
        const filtered = {};
        columns.forEach((col) => {
          filtered[col] = row[col] || "";
        });
        return filtered;
      });

      createData(filteredJSON);

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
      console.log(err);
    }
  };
  reader.readAsArrayBuffer(file);
});

btnDownload.on("click", function () {
  //path of the template
  const filePath = "template/Asset Registry for Property Tag Template.xlsk";

  const link = $("<a>").prop({
    href: filePath,
    download: "Asset Registry for Property Tag Template.xlsx",
  });
  $("body").append(link);
  link[0].click();
  link.remove();
});

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
