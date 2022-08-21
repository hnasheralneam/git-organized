const brootElement = document.getElementById('appppe');
const brootThing = ReactDOM.createRoot(brootElement);


function Header({ title }) {
   return (
   <div>
      <p className="text-5xl">{title}</p>
   </div>);
}
function NameList(props) {
   return (
   <ul>
      {props.names.map((name) => (
         <li className="bg-slate-100 dark:bg-slate-700 m-3 rounded-xl p-4" key={name + Date.now()}>{name}</li>
      ))}
   </ul>
   );
}
function HomePage() {
   const [likes, setLikes] = React.useState(0);
   const [color, setColor] = React.useState("emerald");
   let names = ["Alice", "Emily", "Kate"];

   function handleClick() {
      setLikes(likes + 1);
   }

   function changeColor() {
      setColor("indigo");
   }

   return (
   <div className="bg-gray-50 dark:bg-gray-800 m-4 p-4 rounded-3xl">
      <Header title="🧭" />
      <NameList names={names} />
      <button onClick={handleClick} className="bg-violet-400 text-white font-nunito text-2xl m-3 rounded-xl p-4 underline">👍 Like ({likes})</button>
      <button onClick={changeColor} className={`bg-${color}-500 text-white font-nunito text-2xl m-3 rounded-xl p-4`}>🎨 Change the color of this button</button>
   </div>);
}

brootThing.render(<HomePage />);
