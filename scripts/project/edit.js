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
   filteredData.splice(0, filteredData.length, ...cardArray);
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

function MainInfo(name, about, creator, created) {
   return `
      <div class="px-4 pb-12 mb-1 border-l-4 border-l-emerald-400 rounded-sm">
         <p class="cardName text-3xl">${name}</p>
         <p class="cardDesc text-2xl text-gray-700 dark:text-gray-600">${about}</p>
         <p class="text-gray-600 dark:text-gray-700 float-right">Created by ${creator} ${mdy(created)} at ${thetime(created)} ${dateDiff(created)}</p>
      </div>
   `;
}
function AssigneesTags(assignees, tags) {
   if (assignees[0] == "" && tags[0] == "") { return ""; }
   else {
      if (tags[0] == "") {
         return `
            <div class="my-2 rounded-2xl">
               ${assignees.map((assignee) => ( `<span class="inline-block">@${assignee}</span>` )).join("")}
            </div>
         `;
      }
      else if (assignees[0] == "") {
         return `
            <div class="my-2 rounded-2xl">
               ${tags.map((tag) => ( `<span class="py-1 px-3 mx-0.5 bg-rose-400 dark:bg-rose-600 rounded-full inline-block">${tag}</span>` )).join("")}
            </div>
         `;
      }
      else {
         return `
            <div class="p-3 my-2 rounded-2xl">
               ${assignees.map((assignee) => ( `<span class="py-1 px-2 inline-block">@${assignee}</span>` )).join("")}
               <hr class="m-3 border-none h-[2px] bg-gray-50 dark:bg-gray-800 rounded-full">
               ${tags.map((tag) => ( `<span class="py-1 px-3 mx-0.5 bg-rose-400 dark:bg-rose-600 rounded-full inline-block">${tag}</span>` )).join("")}
            </div>
         `;
      }
   }
}
function Status(status) {
   if (status == "to-do") { return StatusBlock("emerald", status); }
   else { return StatusBlock("gray", status); }
   function StatusBlock(clr, status) {
      return `
         <p class="p-4 mb-1 flex items-center bg-${clr}-100 dark:bg-${clr}-600 rounded-xl">
            <span class="material-symbols-rounded mr-1">pending</span>
            <span class="bg-${clr}-200 dark:bg-${clr}-500 py-1 px-2 rounded-xl">Status: ${status}</span>
         </p>
      `;
   }
}
function PriDif(pri, dif) {
   if (!pri && !dif) { return ""; }
   else {
      return `
      <div class="mb-1 grid grid-cols-2 rounded-xl overflow-hidden">
         <p class="px-4 py-3 flex justify-center items-center text-2xl bg-red-500 dark:bg-red-700 text-white font-notosansmono" title="Priority">
            <span class="material-symbols-rounded mr-1">alarm</span>
            <span class="pl-2">${pri}</span>
         </p>
         <p class="px-4 py-3 flex justify-center items-center text-2xl bg-sky-500 dark:bg-sky-500 text-white font-notosansmono" title="Difficulty">
            <span class="material-symbols-rounded mr-1">speed</span>
            <span class="pl-2">${dif}</span>
         </p>
      </div>
      `;
   }
}
function Arch(card) {
   return `
   <div class="card-options bg-white/[.9] dark:bg-gray-900/[.8] backdrop-blur-sm hover:backdrop-blur-none transition px-3 py-1 rounded-full absolute bottom-2 right-2">
      ${(() => {
         if (card.status !== "archived") {
            return `
            <div>
               <form class="archive archive${card.id}" method="POST" action="/archive-card">
                  <input class="hidden" type="text" name="cardId" id=${card.id} />
                  <button>
                     <span class="material-symbols-rounded text-3xl" title="archive">download</span>
                  </button>
               </form>
            </div>
         `; }
         else {
            return `
            <div>
               <form class="inline un-archive un-archive${card.id}" method="POST" action="/un-archive-card">
                  <input class="hidden" type="text" name="cardId" id=${card.id} />
                  <button>
                     <span class="material-symbols-rounded text-3xl" title="un-archive">upload</span>
                  </button>
               </form>
               <form class="inline delete delete${card.id}" method="POST" action="/delete-card">
                  <input class="hidden" type="text" name="cardId" id=${card.id} />
                  <button>
                     <span class="ml-2 text-rose-400 material-symbols-rounded text-3xl" title="delete">delete</span>
                  </button>
               </form>
            </div>
         `; }
      })()}
      <style>
         @media (prefers-color-scheme: light) { .card-options { box-shadow: 0 0 .08em #ddd; } }
         @media (prefers-color-scheme: dark) { .card-options { box-shadow: 0 0 .08em #383838; } }
      </style>
   </div>
   `
}
function Card(card) {
   return `
      <div class="card py-2 px-4 m-2 bg-white dark:bg-gray-900 border-l-8 border-l-amber-200 dark:border-l-amber-500 rounded-lg relative">
         <div class="grid grid-cols-3">
            <div class="col-span-2">
               ${MainInfo(card.name, card.about, card.creator, card.dateCreated)}
               ${AssigneesTags(card.assignees, card.tags)}
            </div>
            <div class="pl-2">
               ${Status(card.status)}
               ${PriDif(card.priority, card.difficulty)}
               ${(() => { if (card.estTime) { return `
                  <div class="py-2 px-4 mb-1 text-center bg-gray-50 dark:bg-gray-800 rounded-xl relative" title="Estimated time">
                     <p><span class="absolute top-2 left-2 material-symbols-rounded mr-1">schedule</span>${card.estTime}</p>
                  </div>
               `; } else return ""; })()}
               ${(() => { if (card.dueDate) { return `
                  <div class="py-2 px-4 mb-1 text-center bg-gray-50 dark:bg-gray-800 rounded-xl relative" title="Due date">
                     <p><span class="absolute top-2 left-2 material-symbols-rounded mr-1">calendar_month</span>${card.dueDate instanceof Date ? card.dueDate.toLocaleString() : card.dueDate}</p>
                  </div>
               `; } else return ""; })()}
               ${Arch(card)}
            </div>
         </div>
      </div>
   `;
}

const CreateCards = () => {
   return new Promise((resolve) => {
      document.getElementById("cardDiv").outerHTML = `
         <div id="cardDiv" class="bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="cardObject p-1 pt-14 bg-gray-50 dark:bg-gray-800 rounded-lg">
               ${filteredData.map((cardData) => (Card(cardData))).join("")}
            </div>
         </div>
      `;
      document.querySelector(".filterUpdatable").innerHTML = `
         <p class="cardcount p-2 px-4 align-middle text-white bg-rose-400 dark:text-gray-100 text-xl dark:bg-rose-800 inline-block rounded-2xl">${filteredData.length} Cards</p>
         ${(() => { if (filters.status !== "none") { return `<p class="p-2 px-4 align-middle text-white text-xl bg-indigo-500 inline-block rounded-2xl">Status: ${filters.status}</p>` } else return ""; })()}
         ${(() => { if (filters.priority !== "none") { return `<p class="p-2 px-4 align-middle text-white text-xl bg-yellow-500 inline-block rounded-2xl">Priority (${filters.priority})</p>` } else return ""; })()}
         ${(() => { if (filters.difficulty !== "none") { return `<p class="p-2 px-4 align-middle text-white text-xl bg-lime-500 inline-block rounded-2xl">Difficulty (${filters.difficulty})</p>` } else return ""; })()}
         ${(() => { if (filters.date !== "none") { return `<p class="p-2 px-4 align-middle text-white text-xl bg-pink-500 inline-block rounded-2xl">Due Date (${filters.date})</p>` } else return ""; })()}
      `;
      resolve("Cards created!");
   }).then(()=>{
      filteredData.forEach((card) => {
         if (card.status !== "archived") { archiveCard(card); }
         else {
            unarchiveCard(card);
            deleteCard(card);
         }
      });
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
            let cardAmount = 0;
            document.querySelectorAll(".card").forEach(() => { cardAmount++ });
            document.querySelector(".cardcount").textContent = `${cardAmount} Cards`;
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
// Functions
// ======================================

function archiveCard(card) {
   document.querySelector(`.archive${card.id}`).onsubmit = function(event) {
      event.preventDefault();
      $.post("/archive-card", {
         projectId: projectId,
         cardId: card.id
      }).done(() => { filter(); });
   }
}
function unarchiveCard(card) {
   document.querySelector(`.un-archive${card.id}`).onsubmit = function(event) {
      event.preventDefault();
      $.post("/un-archive-card", {
         projectId: projectId,
         cardId: card.id
      }).done(() => { filter(); });
   }
}
function deleteCard(card) {
   document.querySelector(`.delete${card.id}`).onsubmit = function(event) {
      event.preventDefault();
      if (window.confirm(`Sure you want to delete ${card.name}?`)) {
         $.post("/delete-card", {
            projectId: projectId,
            cardId: card.id,
            card: card
         }).done(() => { filter(); });
      }
   }
}

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
      if (data == "Successful creation!") { filter(); console.log("Welcome to the project family, new Card!"); location.reload(); }
   });
});

function toggleFilters() {
   if (document.querySelector('.filter-box').style.right == '0px') {
      document.querySelector('.filter-box').style.right = '-20rem';
      document.querySelector('.filter-box-toggle').style.transform = 'scaleX(1)'
   } else {
      document.querySelector('.filter-box').style.right = '0px';
      document.querySelector('.filter-box-toggle').style.transform = 'scaleX(-1)'
   }
}

function display(input) { document.querySelector("." + input).style.display = "block"; }
function undisplay(input) { document.querySelector("." + input).style.display = "none"; }