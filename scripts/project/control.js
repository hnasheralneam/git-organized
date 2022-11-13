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

function MainInfo({ name, about, creator, dateCreated }) {
   return `
      <div>
         <p class="cardName text-2xl">${name}</p>
         <p class="cardDesc text-xl text-gray-700 dark:text-gray-600">${about}</p>
         <p class="text-gray-600 dark:text-gray-700">Created by ${creator} ${dateDiff(dateCreated)}</p>
      </div>
   `;
}

function Card(card) {
   return `
      <div class="card p-2 px-4 m-2 bg-white dark:bg-gray-700 shadow-sm border-l-4 border-l-amber-200 dark:border-l-amber-500 rounded-lg">
         ${MainInfo(card)}
      </div>
   `;
}

const CreateCards = () => {
   return new Promise((resolve) => {
      document.getElementById("cardBox").outerHTML = `
         <div id="cardBox" class="bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="cardObject p-1 pt-14 bg-gray-50 dark:bg-gray-800 rounded-lg">
               ${filteredData.map((cardData) => (Card(cardData))).join("")}
            </div>
         </div>
      `;
      resolve("Cards created!");
   });
};

CreateCards();

// ======================================
// Cards
// ======================================

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