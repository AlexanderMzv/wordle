import Cell from "./Cell";

function Attempt({ attempt, solved }) {
  const cells = [];

  for (let i = 0; i < 5; i++) {
    cells.push(<Cell key={i} index={i} attempt={attempt} solved={solved} />);
  }

  return <div className="row">{cells}</div>;
}

export default Attempt;
