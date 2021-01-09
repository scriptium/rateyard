function sort_table_by_column(table, column, ascending = true) {
    let direction = ascending ? 1 : -1;
    let tbody = table.tBodies[0];
    let rows = Array.from(tbody.querySelectorAll("tr"));
    const sorted = rows.sort((a, b) => {
        const a_data = a.querySelector(`td:nth-child(${ column + 1 }) > input`).value.trim();
        const b_data = b.querySelector(`td:nth-child(${ column + 1 }) > input`).value.trim();
        return a_data > b_data ? direction : -direction;
    });
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    tbody.append(...sorted);

    table.querySelectorAll("th").forEach(th => th.classList.remove("th_sort_ascending", "th_sort_descending"));
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th_sort_ascending", ascending);
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th_sort_descending", !ascending);
}

function make_readable_row(tbody, selected_row) {
    let rows = tbody.rows;
    for(let row_index = 0; row_index < rows.length; row_index++) {
        for(let col_index = 0; col_index < rows[row_index].cells.length; col_index++) {
            let cell = rows[row_index].cells[col_index];
            if(cell.firstChild.tagName != "INPUT") continue;
            let input = cell.firstChild;
            if(row_index != selected_row)
                input.setAttribute("readonly", "readonly")
            else
                input.removeAttribute("readonly");
        }
    }
}

document.querySelectorAll(".table_sortable .th_sortable").forEach(header => {
    header.addEventListener("click", () => {
        let table = header.parentElement.parentElement.parentElement;
        let column_header = Array.prototype.indexOf.call(header.parentElement.children, header);
        let ascending = header.classList.contains("th_sort_ascending");
        sort_table_by_column(table, column_header, !ascending);
    });
});

document.addEventListener("dblclick", function(event)  {
    if(event.target && event.target.classList.contains("input_text_table")) {
        let tbody = event.target.parentElement.parentElement.parentElement;
        let selected_row = Array.prototype.indexOf.call(tbody.children, event.target.parentElement.parentElement);
        make_readable_row(tbody, selected_row);
    }
});
