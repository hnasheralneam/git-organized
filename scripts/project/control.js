// ======================================
// Filters
// ======================================

let filters = {
   status: "none",
   priority: "none",
   difficulty: "none",
   date: "none"
}

let filteredData = [];
setFilterData();

function filterCardsByStatus(status) {
   filters.status = status;
   filter();
}
function filterCards(type, val) {
   filters.priority = "none";
   filters.difficulty = "none";
   filters.date = "none";
   filters[type] = val;
   filter();
}
function filter() {
   setFilterData();
   if (filters.status != "none") { filteredData = filteredData.filter(card => card.status == filters.status); }
   if (filters.priority != "none") {
      filteredData.forEach((item, index, arr) => { item.priority == "" ? arr.splice(index, 1) : null; });
      filteredData.forEach((item, index, arr) => { item.priority == "" ? arr.splice(index, 1) : null; });

      switch (filters.priority) {
         case "asc":
            filteredData = filteredData.sort((a, b) => { return parseInt(b.priority) - parseInt(a.priority); });
            break;
         case "desc": 
            filteredData = filteredData.sort((a, b) => { return parseInt(b.priority) - parseInt(a.priority); });
            filteredData.reverse();
            break;
         }
   }
   if (filters.difficulty != "none") {
      filteredData.forEach((item, index, arr)=> { item.difficulty == "" ? arr.splice(index, 1) : null; });
      filteredData.forEach((item, index, arr)=> { item.difficulty == "" ? arr.splice(index, 1) : null; });

      switch (filters.difficulty) {
         case "asc":
            filteredData = filteredData.sort((a, b) => { return parseInt(b.difficulty) - parseInt(a.difficulty); });
            break;
         case "desc": 
            filteredData = filteredData.sort((a, b) => { return parseInt(b.difficulty) - parseInt(a.difficulty); });
            filteredData.reverse();
            break;
         }
   }
   if (filters.date != "none") {
      filteredData.forEach((item, index, arr)=> { item.dueDate.length == 0 ? arr.splice(index, 1) : null; });
      filteredData.forEach((item, index, arr)=> { item.dueDate.length == 0 ? arr.splice(index, 1) : null; });

      switch (filters.date) {
         case "asc":
            filteredData = filteredData.sort((item1, item2) => getDate(item1.dueDate) - getDate(item2.dueDate));
            break;
         case "desc": 
            filteredData = filteredData.sort((item1, item2) => getDate(item1.dueDate) - getDate(item2.dueDate));
            filteredData.reverse();
            break;
         }
   }
   CreateCards();
}

function resetFilters() {
   filters.status = "none";
   filters.priority = "none";
   filters.difficulty = "none";
   filters.date = "none";
   setFilterData();
   CreateCards();
}
function setFilterData() {
   filteredData.splice(0, filteredData.length, ...cards);
   filteredData.reverse();
   let toDo =  filteredData.filter(card => card.status == "to-do");
   let archived = filteredData.filter(card => card.status == "archived");
   filteredData = toDo.concat(archived);
}
function getDate(enter) {
   let ourThing = enter.replace("-"," ");
   ourThing = new Date(ourThing);
   return ourThing;
}

// ======================================
// Cards
// ======================================

function Card(card, i) {
   if (card.status == "archived") {
      return `
         <div onclick="showCard(${i})" class="card p-2 px-4 m-2 relative bg-white dark:bg-gray-700 shadow-sm rounded-lg">
            <p class="cardName text-lg">${card.name}</p>
            <p class="cardDesc text-gray-300">${card.about}</p>
            <span class="h-4 w-4 absolute top-2 right-2 inline-block bg-gray-200 rounded-md"></span>
         </div>
      `;
   }
   return `
      <div onclick="showCard(${i})" class="card p-2 px-4 m-2 relative bg-white dark:bg-gray-700 shadow-sm rounded-lg">
         <p class="cardName text-lg">${card.name}</p>
         <p class="cardDesc text-gray-300">${card.about}</p>
         <span class="h-4 w-4 absolute top-2 right-2 inline-block bg-emerald-200 rounded-md"></span>
      </div>
   `;
}

const CreateCards = () => {
   return new Promise((resolve) => {
      document.getElementById("cardBox").outerHTML = `
         <div id="cardBox" class="bg-gray-50 dark:bg-gray-800 rounded-lg">
            ${filteredData.map((cardData, i) => (Card(cardData, i))).join("")}
         </div>
      `;
      resolve("Cards created!");
   });
};

CreateCards();

// ======================================
// Search
// ======================================

// Should only run loop while input is focused
let lastSearchTerm;
setInterval(() => {
   if (document.querySelector(".searchCards") === document.activeElement) {
      let nameIncludes;
      let searchTerm = document.querySelector(".searchCards").value;
      if (searchTerm == "") {
         lastSearchTerm = searchTerm;
         CreateCards();
      }
      if (searchTerm !== "" && lastSearchTerm != searchTerm) {
         lastSearchTerm = searchTerm;
         CreateCards().then(() => {
            document.querySelectorAll(".card").forEach((val) => {
               let cardName = val.querySelector(".cardName");
               let cardDesc = val.querySelector(".cardDesc");

               let namePlaceHolder = cardName.textContent;
               if (namePlaceHolder.toLowerCase().includes(searchTerm.toLowerCase())) {
                  nameIncludes = true;
                  highlight(cardName);
               } else nameIncludes = false;
            
               let descPlaceHolder = cardDesc.textContent;
               if (descPlaceHolder.toLowerCase().includes(searchTerm.toLowerCase())) {
                  highlight(cardDesc);
               } else if (!cardDesc.textContent.includes(searchTerm) && nameIncludes == false) {
                  val.remove();
               }
            });
         });
         function highlight(val) {
            let location = new RegExp(searchTerm, "i");
            let newText = val.textContent.replace(location, `<mark>${searchTerm}</mark>`);
            val.innerHTML = newText;
         }
      }
   }
}, 750);

window.addEventListener("keydown", function (event) {
   if (event.ctrlKey && event.code === "Slash") { document.querySelector(".searchCards").focus(); }
});

// ======================================
// Cards
// ======================================

function showCard(cardIndex) {
   let card = filteredData[cardIndex];
   setVal("Name", card.name);
   setVal("About", card.about);
   setVal("EstTime", card.estTime);
   setVal("Id", card.id);
   // Styling
   document.querySelector(".activeCard").style.borderLeft = "solid .3rem red";
   document.querySelector(".activeCard").style.borderColor = (card.status == "to-do" ? "#a7f3d0" : "#e5e7eb");
   // Text values
   document.querySelector(".acStatus").outerHTML = `
      <div class="acStatus p-1 px-3 my-2 rounded-lg inline-block ${card.status == "to-do" ? "bg-emerald-200" : "bg-gray-200"}">${card.status}</div>
   `;

   if (card.assignees[0] != "") {
      document.querySelector(".acTeam").innerHTML = `
         <div class="m-1">
            ${card.assignees.map((assignee) => {
               return `<span class="mx-0.5">@${assignee}</span>`;
            }).join("")}
         </div>
      `;
   }
   if (card.tags[0] != "") {
      document.querySelector(".acTags").innerHTML = `
         <div class="m-1">
            ${card.tags.map((tag) => {
               return `<span class="p-1 px-2 mx-0.5 bg-blue-400 dark:to-blue-700 rounded-full">${tag}</span>`;
            }).join("")}
         </div>
      `;
   }
   document.querySelector(".acPri").textContent = card.priority;
   document.querySelector(".acDif").textContent = card.difficulty;
   document.querySelector(".acMadeOn").textContent = `Created by ${card.creator} on ${new Date(card.dateCreated).toLocaleString()} ${dateDiff(card.dateCreated)}`;
   card.dueDate ? document.querySelector(".acDue").textContent = `Due by ${card.dueDate}` : document.querySelector(".acDue").textContent = ``;
   function setVal(value, input) {
      document.querySelector(`.ac${value}`).textContent = input;
   }
}