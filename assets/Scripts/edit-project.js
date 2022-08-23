let filteredByStatus = "noned";
let filteredData = cardArray;

function filterCards(status) {
   filteredByStatus = status;
   filteredData = cardArray.filter(card => card.status == status);
   App();
}

const MainInfo = ({ name, about }) => (
   <div>
      <div className="px-4 border-l-4 border-l-emerald-400 rounded-sm">
         <p className="text-3xl">{name}</p>
         <p className="text-2xl text-gray-700 dark:text-gray-600">{about}</p>   
      </div>
   </div>
);

const AssigneesTags = ({ assignees, tags }) => (
   <div>
      <div className="p-3 mb-2 bg-gray-50 dark:bg-gray-800 rounded-2xl">
         {assignees.map((assignee, i) => ( <span key={i} className="py-1 px-2 inline-block">@{assignee}</span> ))}
      </div>
      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
         {tags.map((tag, i) => ( <span key={i} className="py-1 px-3 bg-rose-400 dark:bg-rose-600 rounded-full inline-block">{tag}</span> ))}
      </div>
   </div>
);

const MoreInfo = ({ card }) => (
   <div className="p-3 my-2 bg-gray-50 dark:bg-gray-800 leading-loose rounded-2xl">
      <p className="flex items-center"><span className="material-symbols-rounded mr-1">person</span>Creator: {card.creator}</p>
      <p className="flex items-center"><span className="material-symbols-rounded mr-1">group</span>Contributors: {card.contributors}</p>

      <p className="flex items-center"><span className="material-symbols-rounded mr-1">schedule</span>Estimated time: {card.estTime}</p>
      <p className="flex items-center"><span className="material-symbols-rounded mr-1">calendar_month</span>Due date: {card.dueDate}</p>
      <p className="flex items-center"><span className="material-symbols-rounded mr-1">edit</span>Created: {card.dateCreated.toLocaleString()}</p>   
      <p className="flex items-center mb-1"><span className="material-symbols-rounded mr-1">pending</span><span className={`${card.status == "archived" ? "bg-gray-200 dark:bg-gray-500" : "bg-emerald-200 dark:bg-emerald-500"} py-1 px-2 rounded-xl`}>Status: {card.status}</span></p>
   </div>
);

const PriDifAct = ({ card }) => (
   <div dir="rtl">
      <div className="p-3 mb-2 w-24 bg-gray-50 dark:bg-gray-800 rounded-2xl inline-block">
         <p className="py-1 text-center">Priority</p>
         <div className="pridif text-white text-4xl flex justify-center bg-red-500 relative rounded-2xl font-notosansmono">{card.priority}</div>
         <p className="py-1 text-center">Difficulty</p>
         <div className="pridif text-white text-4xl flex justify-center bg-sky-500 relative rounded-2xl font-notosansmono">{card.difficulty}</div>
      </div>
      {(() => {
         if (card.status !== "archived") {
            return(
               <div className="mr-2 top-0 inline-block">
                  <form className="archive" action="/archive-card" method="POST">
                     <input className="hidden" type="text" name="cardId" id={ `${card.id}` } /><br />
                     <button className="archive-btn p-4 py-3.5 pb-2 bg-gray-50 dark:bg-gray-800 rounded-full" type="text">
                        <span className="material-symbols-rounded text-4xl">inventory_2</span>
                     </button>
                  </form>
               </div>
            );
         }
      })()}
   </div>
);

function Card({ card }) {
   return(
      <div className="py-2 px-4 m-4 bg-white dark:bg-gray-900 border-l-8 border-l-amber-300 dark:border-l-amber-500 rounded-lg relative">
         <div className="grid grid-cols-2">
            <div>
               <MainInfo name={card.name} about={card.about} />
               <MoreInfo card={card} />
               <AssigneesTags assignees={card.assignees} tags={card.tags} />
            </div>
            <div>
               <PriDifAct card={card} />
            </div>
         </div>
      </div>
   );
}

function App() {
   const cardsObj = (
     <div className="p-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
         {(() => {
            if (filteredByStatus !== "noned") { return(
                  <p className="p-2 px-4 mt-2 ml-4 text-white text-xl bg-indigo-500 inline-block rounded-2xl">Status Filter: {filteredByStatus}</p>
               ); }
         })()}
         <p className="p-2 px-4 mt-2 mx-4 text-indigo-900 dark:text-indigo-100 text-xl bg-indigo-200 dark:bg-indigo-800 inline-block rounded-2xl">{filteredData.length} Cards</p>
         {filteredData.map((cardData, i) => ( <Card card={cardData} key={i} /> ))}
      </div>
   );
   ReactDOM.render(cardsObj, document.getElementById("cardDiv"))
}

App();
setInterval(App, 5000);
