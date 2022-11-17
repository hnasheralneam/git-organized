// ======================================
// Data
// ======================================

let currentCard, lastCard;

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
function setFilterData(theseCards = cards) {
   filteredData.splice(0, filteredData.length, ...theseCards);
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
   return `
      <div onclick="showCard(${i})" id="c${card.id}" class="card p-2 px-4 m-2 relative bg-white dark:bg-gray-700 shadow-sm dark:shadow-gray-900 rounded-lg">
         <p class="cardName text-lg">${card.name}</p>
         <p class="cardDesc text-gray-300">${card.about}</p>
         ${card.status == "archived" ? `<span class="h-4 w-4 absolute top-2 right-2 inline-block bg-gray-200 dark:bg-gray-400 rounded-md"></span>` : `<span class="h-4 w-4 absolute top-2 right-2 inline-block bg-emerald-200 dark:bg-emerald-500 rounded-md"></span>`}
      </div>
   `;
   // Diffrent style
   // return `
   //    <div onclick="showCard(${i})" class="card py-4 px-4 relative border-b-[.1rem] border-gray-50 dark:border-gray-700 bg-white dark:bg-gray-800">
   //       <p class="cardName text-lg">${card.name}</p>
   //       <p class="cardDesc text-gray-300">${card.about}</p>
   //       ${card.status == "archived" ? `<span class="h-4 w-4 absolute top-4 right-2 inline-block bg-gray-200 dark:bg-gray-400 rounded-md"></span>` : `<span class="h-4 w-4 absolute top-4 right-2 inline-block bg-emerald-200 dark:bg-emerald-500 rounded-md"></span>`}
   //    </div>
   // `;
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
         findActiveCard();
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
         findActiveCard();
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

   lastCard = currentCard;
   currentCard = card.id;
   findActiveCard();

   // Styling
   document.querySelector(".activeCard").style.borderLeft = "solid .3rem red";
   document.querySelector(".activeCard").style.borderColor = (card.status == "to-do" ? "#a7f3d0" : "#e5e7eb");
   // Text values
   document.querySelector(".acStatus").outerHTML = `
      <div class="acStatus p-1 px-3 my-2 rounded-lg inline-block ${card.status == "to-do" ? "bg-emerald-200 dark:bg-emerald-600" : "bg-gray-200 dark:bg-gray-600"}">${card.status}</div>
   `;

   tagsAssignees(card);
   basicSettings(card);

   document.querySelector(".acPri").textContent = card.priority;
   document.querySelector(".acDif").textContent = card.difficulty;
   document.querySelector(".acMadeOn").textContent = `Created by ${card.creator} on ${new Date(card.dateCreated).toLocaleString()} ${dateDiff(card.dateCreated)}`;
   card.dueDate ? document.querySelector(".acDue").textContent = `Due by ${card.dueDate}` : document.querySelector(".acDue").textContent = ``;

   function setVal(value, input) {
      document.querySelector(`.ac${value}`).textContent = input;
   }
}

function tagsAssignees(card) {
   if (card.assignees.length != 0 && card.assignees[0] != "") {
      document.querySelector(".acTeam").innerHTML = `
         <div class="m-1">
            ${card.assignees.map((assignee) => {
               return `<span class="mx-0.5">@${assignee}</span>`;
            }).join("")}
         </div>
      `;
   } else document.querySelector(".acTeam").innerHTML = "";
   if (card.tags.length != 0 && card.tags[0] != "") {
      document.querySelector(".acTags").innerHTML = `
         <div class="m-1">
            ${card.tags.map((tag) => {
               return `<span class="p-1 px-2 mx-0.5 bg-blue-400 dark:to-blue-700 rounded-full">${tag}</span>`;
            }).join("")}
         </div>
      `;
   } else document.querySelector(".acTags").innerHTML = "";
}
function basicSettings(card) {
   document.querySelector(".btn-arch").setAttribute("disabled", true);
   document.querySelector(".btn-unar").setAttribute("disabled", true);
   document.querySelector(".btn-delt").setAttribute("disabled", true);

   if (card.status == "archived") {
      document.querySelector(".btn-unar").disabled = false;
      document.querySelector(".btn-delt").disabled = false;

      document.querySelector(".btn-unar").onclick = () => {
         $.post("/un-archive-card", {
            projectId: projectId,
            cardId: card.id
         }).done(() => { getProject(); filter(); });
      }
      document.querySelector(".btn-delt").onclick = () => {
         if (window.confirm(`Sure you want to delete ${card.name}?`)) {
            $.post("/delete-card", {
               projectId: projectId,
               cardId: card.id,
               card: card
            }).done(() => { getProject(); filter(); });
         }
      }
   }
   else {
      document.querySelector(".btn-arch").disabled = false;

      document.querySelector(".btn-arch").onclick = () => {
         $.post("/archive-card", {
            projectId: projectId,
            cardId: card.id
         }).done(() => { getProject(); filter(); });
      }
   }
}

// ======================================
// Get Cards
// ======================================

function getProject() {
   $.post("/fetch-project", {
      project: projectID
   }).done((data) => {
      setFilterData(data);
      CreateCards();
      let currentCardIndex = filteredData.findIndex(card => card.id === currentCard);
      showCard(currentCardIndex);
   });
}

setInterval(() => { getProject(); }, 20000)

// ======================================
// OTHER FUNCS
// ======================================

function findActiveCard() {
   if (lastCard) document.querySelector(`#c${lastCard}`).classList.remove("bg-[#f3f4f6]", "dark:bg-[#2B3544]");
   if (lastCard) document.querySelector(`#c${lastCard}`).classList.add("bg-white", "dark:bg-gray-700");
   document.querySelector(`#c${currentCard}`).classList.remove("bg-white", "dark:bg-gray-700");
   document.querySelector(`#c${currentCard}`).classList.add("bg-[#f3f4f6]", "dark:bg-[#2B3544]");
}



// ->>>> Later
// Color for dif and pri
// Handle if current card is deleted when auto-update

// Problems
// Regular fetch clears search
// Search ruins active card effect, throws error