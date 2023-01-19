import "../App.css";
import { GiAngelWings } from "react-icons/gi";

function Header({ connect, account, network }) {
  return (
    <div className="header">
      <GiAngelWings className="headerIcon" />
      <p>Conectado a {network} </p>
      {account === "" ? (
        <button onClick={connect} className="button">
          Conectar
        </button>
      ) : (
        <p>...{account.substring(account.length - 7)}</p>
      )}
    </div>
  );
}

export default Header;
