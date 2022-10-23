let filteredData = cardArray.filter(card => card.status != "archived");
filteredData.forEach((element, i) => {
   if (!element.name) { filteredData.splice(i, 1); } // Ick because of one accident I did while fixing somthing. Only needed for Git Organized project
});
filteredData.reverse();

function filterCards(status) {
   filteredData = cardArray.filter(card => card.status == status);
   filteredData.forEach((element, i) => {
      if (!element.name) { filteredData.splice(i, 1); } // Ick because of one accident I did while fixing somthing. Only needed for Git Organized project
   });
   App();
}

function Card(card) {
   return `
      <div class="py-2 px-4 m-4 bg-white dark:bg-gray-900 border-l-8 border-l-amber-300 dark:border-l-amber-500 rounded-lg relative">
         <div class="grid" style="grid-template-columns: 70% 30%">
            <div>
               <div class="px-4 border-l-4 border-l-emerald-400 rounded-sm">
                  <p class="text-2xl">${card.name}</p>
                  <p class="text-xl text-gray-700">${card.about}</p>
               </div>
               <div class="m-1">${card.assignees[0] !== "" ? card.assignees.map((assignee, i) => ( `<span class="py-1 px-3 inline-block">@${assignee}</span>` )).join("") : ""}</div>
               <div class="m-1">${card.tags[0] !== "" ? card.tags.map((tag, i) => ( `<span class="py-1 px-3 bg-rose-400 dark:bg-rose-600 rounded-full inline-block">${tag}</span>` )).join("") : ""}</div>
            </div>
            <div class="p-3 my-2 bg-gray-50 dark:bg-gray-800 rounded-2xl" dir="rtl">
               <p class="flex items-center"><span class="material-symbols-rounded ml-1.5">pending</span><span class="${card.status == "archived" ? "bg-gray-200 dark:bg-gray-500" : "bg-emerald-200 dark:bg-emerald-500"} py-1 px-2 rounded-xl">Status: ${card.status}</span></p>
               ${card.priority ? `<p class="flex items-center"><span class="material-symbols-rounded ml-1.5">alarm</span><span class="mt-0.5 py-1 px-2 bg-red-400 dark:bg-red-600 text-gray-800 dark:text-white rounded-xl">Priority ${card.priority}</span></p>` : ""}
               ${card.difficulty ? `<p class="flex items-center"><span class="material-symbols-rounded ml-1.5">speed</span><span class="mt-0.5 py-1 px-2 bg-sky-400 dark:bg-sky-600 text-gray-800 dark:text-white rounded-xl">Difficulty ${card.difficulty}</span></p>` : ""}
               <p class="flex items-center"><span class="material-symbols-rounded ml-1.5">person</span>Created by ${card.creator}</p>
               ${card.estTime ? `<p class="flex items-center"><span class="material-symbols-rounded ml-1.5">schedule</span>Estimated time: ${card.estTime}</p>` : ""}
               ${card.dueDate ? `<p class="flex items-center"><span class="material-symbols-rounded ml-1.5">calendar_month</span>Due date: ${card.dueDate}</p>` : ""}
            </div>
         </div>
      </div>
   `;
}

function CreateCards() {
   const cardsObj = `
     <div class="p-1 mr-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
         ${filteredData.map((cardData) => ( Card(cardData) )).join("")}
      </div>
   `;
   document.querySelector("#cardDiv").innerHTML = cardsObj;
}

CreateCards();