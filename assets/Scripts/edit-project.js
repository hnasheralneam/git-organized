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

const MainInfo = ({ name, about, creator, created }) => (
   <div className="px-4 pb-6 mb-2 border-l-4 border-l-emerald-400 rounded-sm">
      <p className="text-3xl">{name}</p>
      <p className="text-2xl text-gray-700 dark:text-gray-600">{about}</p>   
      <p className="text-gray-600 dark:text-gray-700 float-right">Created on {created} by {creator}</p>
   </div>
);
const AssigneesTags = ({ assignees, tags }) => (
   <div>
      {(() => {
         if (assignees[0] == "" && tags[0] == "") { return; }
         else {
            return(
               <div className="p-3 mb-2 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  {assignees[0] != "" ? assignees.map((assignee, i) => ( <span key={i} className="py-1 px-2 inline-block">@{assignee}</span> )) : null}
                  {(() => {
                     if (tags[0] !== "") {
                        return(
                           <div>
                              <hr className="m-4 border-none h-[2px] dark:bg-gray-700 rounded-full" />
                              {tags.map((tag, i) => ( <span key={i} className="py-1 px-3 mr-1 mb-1 bg-rose-400 dark:bg-rose-600 rounded-full inline-block">{tag}</span> ))}      
                           </div>
                        );
                     }
                  })()}
               </div>
            );
         }
      })()}
   </div>
);
const Arch = ({ card }) => (
   <div dir="rtl">
      {(() => {
         if (card.status !== "archived") {
            return(
               <div className="mr-2 top-0 inline-block">
                  <form className={`archive archive${filteredData.indexOf(card)}`} action="/archive-card" method="POST">
                     <input className="hidden" type="text" name="cardId" id={ `${card.id}` } /><br />
                     <button className="archive-btn p-2 pb-1 bg-yellow-50 dark:bg-zinc-800 shadow-inner shadow-amber-100 dark:shadow-zinc-900 rounded-md absolute bottom-2 right-2" type="text">
                        <span className="material-symbols-rounded text-3xl" title="archive">download</span>
                     </button>
                  </form>
                  {archiveCard(card, 2000)}
               </div>
            );
         }
         else {
            return(
               <div className="mr-2 top-0 inline-block">
                  <form className={`un-archive un-archive${filteredData.indexOf(card)}`} action="/un-archive-card" method="POST">
                     <input className="hidden" type="text" name="cardId" id={ `${card.id}` } /><br />
                     <button className="un-archive-btn p-2 pb-1 bg-stone-50 dark:bg-stone-800 shadow-inner shadow-stone-200 dark:shadow-stone-900 rounded-md absolute bottom-2 right-2" type="text">
                        <span className="material-symbols-rounded text-3xl" title="un-archive">upload</span>
                     </button>
                  </form>
                  {unarchiveCard(card, 2000)}
               </div>
            );
         }
      })()}
   </div>
);
const Status = ({ status }) => (
   <div>
      {(() => {
         if (status == "to-do") { return(
            <p className="p-4 mb-1 flex items-center bg-emerald-100 dark:bg-emerald-600 rounded-xl">
               <span className="material-symbols-rounded mr-1">pending</span>
               <span className="bg-emerald-200 dark:bg-emerald-500 py-1 px-2 rounded-xl">Status: {status}</span>
            </p>
         ); }
         else { return(
            <p className="p-4 mb-1 flex items-center bg-gray-100 dark:bg-gray-600 rounded-xl">
               <span className="material-symbols-rounded mr-1">pending</span>
               <span className="bg-gray-200 dark:bg-gray-500 py-1 px-2 rounded-xl">Status: {status}</span>
            </p>
         ); }
      })()}
   </div>
);
function Card({ card }) {
   return(
      <div className="card py-2 px-4 m-2 bg-white dark:bg-gray-900 border-l-8 border-l-amber-300 dark:border-l-amber-500 rounded-lg relative">
         <div className="grid grid-cols-3">
            <div className="col-span-2">
               <MainInfo name={card.name} about={card.about} creator={card.creator} created={card.dateCreated} />
               <AssigneesTags assignees={card.assignees} tags={card.tags} />
            </div>
            <div className="pl-2">
               <Status status={card.status} />
               <div className="mb-1 grid grid-cols-2 rounded-xl overflow-hidden">
                  <p className="text-center text-2xl bg-red-500 dark:bg-red-700 text-white font-notosansmono"><span className="text-sm">Priority:</span><br /> {card.priority}</p>
                  <p className="text-center text-2xl bg-sky-500 dark:bg-sky-500 text-white font-notosansmono"><span className="text-sm">Difficulty:</span><br /> {card.difficulty}</p>
               </div>
               <div className="py-2 px-4 mb-1 text-center bg-gray-50 dark:bg-gray-800 rounded-xl relative">
                  <p><span className="absolute top-2 left-2 material-symbols-rounded mr-1">schedule</span>Estimated time:<br /> {card.estTime}</p>
               </div>
               <div className="py-2 px-4 mb-1 text-center bg-gray-50 dark:bg-gray-800 rounded-xl relative">
                  <p><span className="absolute top-2 left-2 material-symbols-rounded mr-1">calendar_month</span>Due date:<br /> {card.dueDate instanceof Date ? card.dueDate.toLocaleString() : card.dueDate}</p>
               </div>

               <Arch card={card} />
            </div>
         </div>
      </div>
   );
}
const Filter = () => (
   <div>
      <p className="p-2 px-4 mt-2 ml-2 text-indigo-900 dark:text-indigo-100 text-xl bg-indigo-200 dark:bg-indigo-800 inline-block rounded-2xl">{filteredData.length} Cards</p>
      {(() => { if (filters.status !== "none") { return( <p className="p-2 px-4 mt-2 ml-2 text-white text-xl bg-indigo-500 inline-block rounded-2xl">Status: {filters.status}</p> ); } })()}
      {(() => { if (filters.priority !== "none") { return( <p className="p-2 px-4 mt-2 ml-2 text-white text-xl bg-yellow-500 inline-block rounded-2xl">Priority ({filters.priority})</p> ); } })()}
      {(() => { if (filters.difficulty !== "none") { return( <p className="p-2 px-4 mt-2 ml-2 text-white text-xl bg-lime-500 inline-block rounded-2xl">Difficulty ({filters.difficulty})</p> ); } })()}
      {(() => { if (filters.date !== "none") { return(<p className="p-2 px-4 mt-2 ml-2 text-white text-xl bg-pink-500 inline-block rounded-2xl">Due Date ({filters.date})</p>); } })()}
   </div>
);

function App() {
   const cardsObj = (
     <div className="p-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
         <Filter />
         <div className="cardObject">
            {filteredData.map((cardData, i) => ( <Card card={cardData} key={i} /> ))}
         </div>
      </div>
   );
   ReactDOM.render(cardsObj, document.getElementById("cardDiv"));
}

App();
setInterval(App, 5000);


function display(input) {
   document.querySelector("." + input).style.display = "block";
}
function undisplay(input) {
   document.querySelector("." + input).style.display = "none";
}

function archiveCard(card, interval) {
   setTimeout(() => {
      document.querySelector(`.archive${filteredData.indexOf(card)}`).onsubmit = function(event) {
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
      document.querySelector(`.un-archive${filteredData.indexOf(card)}`).onsubmit = function(event) {
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
