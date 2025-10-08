import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api.php")  // or /api/endpoint
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div>
      <h1>React + PHP Integration</h1>
      <p>{data}</p>
    </div>
  );
}

export default App;
