"use strict";

import { defaultTable } from "./modules/table-object.js";

let wbData = null;
let table = null;
let school = $.trim($("#schoolName").val());
let validator = $.trim($("#validatorName").val());
let position = $.trim($("#position").val());
const chkSelectAll = $("#selectAll");
const btnLogo = $("#logoUpload");
const btnUpload = $("#xlsxUpload");
const dataTable = $("#dataTable");
let logoDataURL = null;
let logoPreview = $("#logoPreview");
const columns = ["Property Number", "Asset Item", "Manufacturer", "Model", "Serial Number", "Cost of Acquisition", "Date of Acquisition", "Date Issued", "Name of Accountable Officer", "Asset Location", "Current Condition"];

table = dataTable.DataTable(defaultTable());

//select all rows when checked
chkSelectAll.on("change", function () {
  const checked = $(this).is(":checked");
  $("#dataTable tbody input.row-checkbox").prop("checked", checked).trigger("change");
});

//update selected count
function updateSelectedCount() {
  const count = $("#dataTable tbody input.row-checkbox:checked").length;
  $("#selectedCount").text(count + " selected");
}

$("#dataTable tbody").on("change", "input.row-checkbox", function () {
  updateSelectedCount();
  //uncheck header select checkboxes if none were checked
  const all = $("#dataTable tbody input.row-checkbox").length;
  const checked = $("#dataTable tbody input.row-checkbox:checked").length;
  $("#selectAll").prop("checked", all > 0 && all === checked);
});

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

  if (!files) return;
  if (!files.name.match(/\.xlsx$/i)) {
    alert("Please upload an .xlsx file (Excel workbook).");
    event.target.value = "";
    return;
  }
});
