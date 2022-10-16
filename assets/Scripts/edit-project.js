// ======================================
// Filters
// ======================================

let filters = {
   status: "none",
   priority: "none",
   difficulty: "none",
   date: "none"
}

let filteredData = cardArray;

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
   filteredData = cardArray;
   if (filters.status != "none") { filteredData = filteredData.filter(card => card.status == filters.status); }
   if (filters.priority != "none") {
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
   App();
}
function resetFilters() {
   filters.status = "none";
   filters.priority = "none";
   filters.difficulty = "none";
   filters.date = "none";
   filteredData = cardArray;
   App();
}
function getDate(enter) {
   let ourThing = enter.replace("-"," ");
   ourThing = new Date(ourThing);
   return ourThing;
}

// ======================================
// Cards
// ======================================

function Arch(card) {
   return `
   <div class="px-3 py-1 rounded-full absolute bottom-2 right-2" style="box-shadow: 0 0 .08em #ddd;">
      ${(() => {
         if (card.status !== "archived") { return `
            <div>
               <form class="archive archive${card.id}" method="POST" action="/archive-card">
                  <input class="hidden" type="text" name="cardId" id=${card.id} />
                  <button>
                     <span class="material-symbols-rounded text-3xl" title="archive">download</span>
                     ${/* style test purposes only <span className="ml-2 material-symbols-rounded text-3xl" title="archive">download</span> */""}
                  </button>
                  ${/* We need this here to set up the onclick */""}
                  ${(() => { archiveCard(card, 100); return ""; })()}
               </form>
            </div>
         `; }
         else { return `
            <div>
               <form class="un-archive un-archive${card.id}" method="POST" action="/un-archive-card">
                  <input class="hidden" type="text" name="cardId" id=${card.id} />
                  <button>
                     <span class="material-symbols-rounded text-3xl" title="un-archive">upload</span>
                  </button>
                  ${(() => { unarchiveCard(card, 100); return ""; })()}
               </form>
            </div>
         `; }
      })()}
   </div>
   `
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
function MainInfo(name, about, creator, created) {
   return `
      <div class="px-4 pb-6 mb-2 border-l-4 border-l-emerald-400 rounded-sm">
         <p class="text-3xl">${name}</p>
         <p class="text-2xl text-gray-700 dark:text-gray-600">${about}</p>
         <p class="text-gray-600 dark:text-gray-700 float-right">Created by ${creator} ${mdy(created)} at ${thetime(created)} ${dateDiff(created)}</p>
      </div>
   `;
}
function AssigneesTags(assignees, tags) {
   if (assignees[0] == "" && tags[0] == "") { return; }
   else {
      return `
      <div class="p-3 mb-2 bg-gray-50 dark:bg-gray-800 rounded-2xl">
         ${assignees[0] != "" ? assignees.map((assignee, i) => ( `<span key={i} class="py-1 px-2 inline-block">@${assignee}</span>` )).join("") : null}
         ${(() => {
            if (tags[0] !== "") {
               return `
                  <div>
                     <hr class="m-4 border-none h-[2px] dark:bg-gray-700 rounded-full" />
                     ${tags.map((tag, i) => ( `<span key={i} class="py-1 px-3 mr-1 mb-1 bg-rose-400 dark:bg-rose-600 rounded-full inline-block">${tag}</span>` )).join("")}
                  </div>
               `;
            }
         })()}
      </div>
   `; }
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
               <div class="mb-1 grid grid-cols-2 rounded-xl overflow-hidden">
                  <p class="px-4 py-3 flex justify-center items-center text-2xl bg-red-500 dark:bg-red-700 text-white font-notosansmono" title="Priority">
                     <span class="material-symbols-rounded mr-1">alarm</span>
                     &nbsp;
                     ${card.priority}
                  </p>
                  <p class="px-4 py-3 flex justify-center items-center text-2xl bg-sky-500 dark:bg-sky-500 text-white font-notosansmono" title="Difficulty">
                     <span class="material-symbols-rounded mr-1">speed</span>
                     &nbsp;
                     ${card.difficulty}
                  </p>
               </div>
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

function CreateCards() {
   document.getElementById("cardDiv").outerHTML = `
      <div id="cardDiv" class="p-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
         <div class="filter">
            <p class="p-2 px-4 mt-2 ml-2 text-indigo-900 dark:text-indigo-100 text-xl bg-indigo-200 dark:bg-indigo-800 inline-block rounded-2xl">${filteredData.length} Cards</p>
            ${(() => { if (filters.status !== "none") { return `<p class="p-2 px-4 mt-2 ml-2 text-white text-xl bg-indigo-500 inline-block rounded-2xl">Status: ${filters.status}</p>` } else return ""; })()}
            ${(() => { if (filters.priority !== "none") { return `<p class="p-2 px-4 mt-2 ml-2 text-white text-xl bg-yellow-500 inline-block rounded-2xl">Priority (${filters.priority})</p>` } else return ""; })()}
            ${(() => { if (filters.difficulty !== "none") { return `<p class="p-2 px-4 mt-2 ml-2 text-white text-xl bg-lime-500 inline-block rounded-2xl">Difficulty (${filters.difficulty})</p>` } else return ""; })()}
            ${(() => { if (filters.date !== "none") { return `<p class="p-2 px-4 mt-2 ml-2 text-white text-xl bg-pink-500 inline-block rounded-2xl">Due Date (${filters.date})</p>` } else return ""; })()}
         </div>
         <div class="cardObject">
            ${filteredData.map((cardData, i) => ( Card(cardData) )).join("")}
         </div>
      </div>
   `;
}

CreateCards();
setInterval(CreateCards, 5000);

// ======================================
// Functions
// ======================================

function archiveCard(card, interval) {
   setTimeout(() => {
      document.querySelector(`.archive${card.id}`).onsubmit = function(event) {
         event.preventDefault();
         $.post("/archive-card", {
            projectId: projectId,
            cardId: card.id
         }).done(() => { filter(); });
      }
   }, interval);
}

function unarchiveCard(card, interval) {
   setTimeout(() => {
      document.querySelector(`.un-archive${card.id}`).onsubmit = function(event) {
         event.preventDefault();
         $.post("/un-archive-card", {
            projectId: projectId,
            cardId: card.id
         }).done(() => { filter(); });
      }
   }, interval);
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