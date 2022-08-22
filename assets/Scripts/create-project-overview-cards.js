// requirejs.config({
//    paths: {
//       "react": "https://unpkg.com/react@17/umd/react.production.min",
//       "react-dom": "https://unpkg.com/react-dom@17/umd/react-dom.production.min",
//    },
// });

// requirejs(["react", "react-dom"], function (React, ReactDOM) {
//    const employees = [
//       { id: 4, name: 'Dean', country: 'Denmark' },
//       { id: 3, name: 'Carl', country: 'Canada' },
//       { id: 2, name: 'Bob', country: 'Belgium' },
//       { id: 1, name: 'Alice', country: 'Austria' },
//       { id: 5, name: 'Ethan', country: 'Egypt' },
//     ];

//    let filtered = employees.filter(item => item.id > 3);



//    const User = ({ name, id, country }) => (
//       <div className="px-4 m-4 mt-0 pt-2 pb-8 border-b-2 dark:border-b-white border-b-gray-900 last:border-b-0">
//          <h2>id: {name}</h2>
//          <h2>name: {id}</h2>
//          <h2>country: {country}</h2>
//       </div>
//    );
   
//    function App() {
//       return (
//         <div className="m-2 pt-4 bg-white dark:bg-gray-900 rounded-xl">
//             {filtered.map((user) => (
//                <User
//                   name={user.name}
//                   id={user.id}
//                   country={user.country}
//                />
//             ))}
//          </div>
//       );
//    }

//    ReactDOM.render(<App />, document.getElementById("mydiv"));
// });