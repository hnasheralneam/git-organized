requirejs.config({
   paths: {
      "react": "https://unpkg.com/react@17/umd/react.production.min",
      "react-dom": "https://unpkg.com/react-dom@17/umd/react-dom.production.min",
   },
});

requirejs(["react", "react-dom"], function (React, ReactDOM) {
   let filteredData = cardArray.filter(card => card.status != "archived");

   const MainInfo = ({ name, about }) => (
      <div className="px-4 border-l-4 border-l-emerald-400 rounded-sm">
         <p className="text-2xl">{name}</p>
         <p className="text-xl text-gray-700">{about}</p>
      </div>
   );

   const Assi = ({ assignee }) => (
      <span className="py-1 px-3 inline-block">@{assignee}</span>
   );

   const Tags = ({ tag }) => (
      <span className="py-1 px-3 bg-rose-400 dark:bg-rose-600 rounded-full inline-block">{tag}</span>
   );

   const AssigneesTags = ({ assignees, tags, name }) => (
      <div>
         {/* <p>{Array.isArray(tags) ? console.log(true) : console.log("Bad:", name)}</p> */}
         <div className="m-1">{assignees.map((assignee) => ( <Assi assignee={assignee} /> ))}</div>
         <div className="m-1">{tags.map((tag) => ( <Tags tag={tag} /> ))}</div>
      </div>
   );

   const MoreInfo = (props) => (
      <div className="p-3 my-2 bg-gray-50 dark:bg-gray-800 rounded-2xl col-span-3">
         <p className="flex items-center mb-1"><span className="material-symbols-rounded mr-1">group</span>Contributors: {props.card.contributors}</p>
         <p className="flex items-center mb-1"><span className="material-symbols-rounded mr-1">schedule</span>Estimated time: {props.card.estTime}</p>
         <p className="flex items-center mb-1"><span className="material-symbols-rounded mr-1">calendar_month</span>Due date: {props.card.dueDate}</p>
         <p className="flex items-center mb-1"><span className="material-symbols-rounded mr-1">pending</span><span className="bg-emerald-200 dark:bg-emerald-500 py-1 px-2 rounded-xl">Status: {props.card.status}</span></p>
      </div>
   );

   const PriDif = ({ card }) => (
      <div dir="rtl">
         <div className="p-3 pr-4 my-2 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <div title="Priority" className="h-16 w-16 text-white text-4xl bg-red-500 rounded-2xl font-notosansmono mb-2 flex justify-center items-center">{card.priority}</div>
            <div title="Difficulty" className="h-16 w-16 text-white text-4xl bg-sky-500 rounded-2xl font-notosansmono flex justify-center items-center">{card.difficulty}</div>
         </div>
      </div>
   );

   function Card({card}) {
      return(
         <div className="py-2 px-4 m-4 bg-white dark:bg-gray-900 border-l-8 border-l-amber-300 dark:border-l-amber-500 rounded-lg relative">
            <div className="grid grid-cols-9 gap-2">
               <div className="col-span-5">
                  <MainInfo name={card.name} about={card.about} />
                  <AssigneesTags assignees={card.assignees} tags={card.tags} name={card.name} />
               </div>
               <MoreInfo card={card} />
               <PriDif card={card} />
            </div>
         </div>
      );
   }
   
   function App() {
      return (
        <div className="p-1 mr-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {filteredData.map((cardData) => ( <Card card={cardData} /> ))}
         </div>
      );
   }


   setInterval(ReactDOM.render(<App />, document.getElementById("cardDiv")), 10000);
});