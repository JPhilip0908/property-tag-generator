"use strict";

import { defaultTable } from "./modules/table-object.js";

let wbData = null;
let table = null;
const selectAllchkBox = $("#selectAll");

const columns = ["Property Number", "Asset Item", "Manufacturer", "Model", "Serial Number", "Cost of Acquisition", "Date of Acquisition", "Date Issued", "Name of Accountable Officer", "Asset Location", "Current Condition"];

table = $("#dataTable").DataTable(defaultTable());

selectAllchkBox.on("change", function () {
  const checked = $(this).is(":checked");
  $("#dataTable tbody input.row-checkbox").prop("checked", checked).trigger("change");
});
