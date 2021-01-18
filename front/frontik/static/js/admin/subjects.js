function save_changes() {
  let subjects_to_delete = document.querySelectorAll('[data-delete="true"]');
  let subjects_to_edit = document.querySelectorAll('[data-edit="true"]');
  let subjects_to_delete_json = [];
  let subjects_to_edit_json = [];
  for(let subject_index = 0; subject_index < subjects_to_delete.length; subject_index++) {
      subjects_to_delete_json.push(subjects_to_delete[subject_index].getAttribute("value"));
  }
  for(let subject_index = 0; subject_index < subjects_to_edit.length; subject_index++) {
      subjects_to_edit_json.push({
          "id": subjects_to_edit[subject_index].getAttribute("value"),
          "name": subjects_to_edit[subject_index].cells[0].firstChild.value
      });
  }
  request_json = {
      "subjects_to_delete": subjects_to_delete_json,
      "subjects_to_edit": subjects_to_edit_json
  };
  console.log(request_json);
  let client = new XMLHttpRequest();
  client.open("POST", "http://localhost:5000/admin/subjects/save_changes");
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