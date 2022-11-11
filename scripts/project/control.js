function showCard(card) {
   setVal("Name", card.name);
   setVal("About", card.about);
   setVal("Status", card.status);
   document.querySelector(".acTeam").textContent = card.assignees;
   document.querySelector(".acTags").textContent = card.tags;
   document.querySelector(".acPri").textContent = card.priority;
   document.querySelector(".acDif").textContent = card.difficulty;
   document.querySelector(".acMadeOn").textContent = `Created by ${card.creator} on ${new Date(card.dateCreated).toLocaleString()}`;
   document.querySelector(".acDue").textContent = `Due by ${card.dueDate}`;
   document.querySelector(".acEstTime").textContent = card.estTime;
   document.querySelector(".acId").textContent = card.id;
   function setVal(value, input) {
      document.querySelector(`.ac${value}`).textContent = input;
   }
}
