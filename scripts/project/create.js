$("#create-new-project").submit(function(event) {
   let projectName = this.name.value;
   event.preventDefault();
   $.post("/newproject", {
      name: projectName,
      about: this.about.value,
   }).done(function(data) {
      document.querySelector(".create-project-text").textContent = data;
      if (data == "Successful creation!") {
         document.querySelector("#letsGo").action = `/${projectName}/dashboard`;
         document.querySelector("#letsGo").submit();
      }
   });
});
