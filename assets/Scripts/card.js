function display(input) {
   document.querySelector("." + input).style.display = "block";
}
function undisplay(input) {
   document.querySelector("." + input).style.display = "none";
}

(() => {
   document.querySelectorAll(".card").forEach((obj, i, arr) => {
      document.querySelectorAll(".archive")[i].onsubmit = function(event) {
         event.preventDefault();
         $.post("/archive-card", {
            projectId: "<%= thisProject.id %>",
            cardId: this.cardId.id
         }).done(function() { obj.remove(); });
      }
   });
})();

$("#create-new-card").submit(function(event) {
   event.preventDefault();
   let tagsArray = this.tags.value.split(" ");
   let assigneesArray = this.assignees.value.split(" ");
   console.log(this.tags.value, tagsArray, typeof tagsArray);

   $.post("/newcard", {
      name: this.name.value,
      about: this.about.value,
      dueDate: this.dueDate.value,
      estTime: this.estTime.value,
      tags: tagsArray,
      assignees: assigneesArray,
      priority: this.priority.value,
      difficulty: this.difficulty.value,
      projectName: this.projectName.value
   }).done(function(data) {
      document.querySelector(".create-card-text").textContent = data;
      if (data == "Successful creation!") { location.reload(); }
   });
});
