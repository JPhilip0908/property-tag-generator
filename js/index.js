let wbData = null;
let table = null;

const columns = ["Property Number", "Asset Item", "Manufacturer", "Model", "Serial Number", "Cost of Acquisition", "Date of Acquisition", "Date Issued", "Name of Accountable Officer", "Asset Location", "Current Condition"];

$(document).ready(function () {
  table = $("#dataTable").DataTable({
    data: [],
    columns: [
      {
        data: null,
        orderable: false,
        searchable: false,
        render: function (data, type, row, meta) {
          return `<input type = "checkbox" class = "row-checkbox" data-rowid ="${row.rowId}">`;
        },
      },
    ],
    order: [],
    pageLength: 10,
    language: {
      emptyTable: "No data. Upload Asset Registry file(prescribed template) to populate the table.",
    },
  });
});
