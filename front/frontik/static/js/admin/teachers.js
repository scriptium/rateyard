function save_changes() {
  let teachers_to_delete = document.querySelectorAll('[data-delete="true"]');
  let teachers_to_edit = document.querySelectorAll('[data-edit="true"]');
  let teachers_to_delete_json = [];
  let teachers_to_edit_json = [];
  for(let teacher_index = 0; teacher_index < teachers_to_delete.length; teacher_index++) {
      teachers_to_delete_json.push(teachers_to_delete[teacher_index].getAttribute("value"));
  }
  for(let teacher_index = 0; teacher_index < teachers_to_edit.length; teacher_index++) {
      teachers_to_edit_json.push({
          "id": teachers_to_edit[teacher_index].getAttribute("value"),
          "username": teachers_to_edit[teacher_index].cells[0].firstChild.value,
          "full_name": teachers_to_edit[teacher_index].cells[1].firstChild.value,
          "email": teachers_to_edit[teacher_index].cells[2].firstChild.value
      });
  }
  request_json = {
      "teachers_to_delete": teachers_to_delete_json,
      "teachers_to_edit": teachers_to_edit_json
  };
  console.log(request_json);
  let client = new XMLHttpRequest();
  client.open("POST", "http://127.0.0.1:5000/admin/teachers/save_changes");
  client.setRequestHeader("Content-Type", "application/json");
  client.onreadystatechange = function() {
      if (this.status==200)
      {
          document.location.reload(true);
      }
      else {
          document.body.innerHTML = "Something went wrong...\n" + this.responseText;
      }
  }
  client.send(JSON.stringify(request_json));
}