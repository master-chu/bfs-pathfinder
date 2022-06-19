export default function Legend() {
  const base = {
    border: "1px solid black",
    display: "inline-block",
    width: "20px",
    textAlign: "center" as const,
  };
  return (
    <div>
      <h3> Legend </h3>
      <div>
        <span style={{ ...base, backgroundColor: "white" }}>0</span> - walkable
      </div>
      <div>
        <span style={{ ...base, backgroundColor: "palegreen" }}>0</span> -
        shortest path
      </div>
      <div>
        <span style={{ ...base, backgroundColor: "gray" }}>1</span> -
        obstruction
      </div>
      <div>
        <span style={{ ...base, backgroundColor: "orange" }}>0</span> - start
      </div>
      <div>
        <span style={{ ...base, backgroundColor: "aqua" }}>0</span> - end
      </div>
    </div>
  );
}