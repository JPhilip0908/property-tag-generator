export const defaultTable = function () {
  return {
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
  };
};
