import "./App.css";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import erc721Abi from "./abi/contract.json";
import Header from "./components/Header";
import Home from "./pages/home";
import Connected from "./pages/connected";

function App() {
  const [listaPropias, setListaP] = useState([]);
  const [listaPagando, setListaR] = useState([]);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState("");
  const [network, setNetwork] = useState("none");
  const [mainNetwork, setMainN] = useState(true);
  
  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const newProvider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = newProvider.getSigner();
      const network = await newProvider.getNetwork();
      if (network.chainId === 5){
        const contract = new ethers.Contract('0xc6f6F35BcC7a668A40Ef07551466718a335D41Cf', erc721Abi, signer);
        const casas = (await contract.getCasas())
        userWallet(casas,accounts[0]);
        setContract(contract)
        setMainN(true)
      } else {
        setMainN(false)
      }
      updateNetwork(network.chainId);
      setAccount(accounts[0]);
    } else {
      alert("Please install metamask to connect.");
    }
  };
  const userWallet = (array, user) => {
    const listaPropias = []
    const listaPagando = []
    for(let i=0; i<array.length;i++){
      const casa = array[i]
      if(casa.houseOwner.toLowerCase() === user){
        listaPropias.push(casa)
      } 
      if(casa.rentadoPor.toLowerCase() === user){
        listaPagando.push(casa)
      }
    }
    setListaP(listaPropias)
    setListaR(listaPagando)
  }
  const updateNetwork = (chainId) => {
    switch(chainId) {
      case 1:
        return setNetwork("Ethereum Mainnet");
      case 5:
        return setNetwork("Goerli Testnet");
      case 137:
        return setNetwork("Matic");
      case 80001:
        return setNetwork("Matic (test)");
      default:
        return setNetwork("Unknown");
      }
  }
  const pagar = async (precio, nextPayment, feeIncrement, id) => {
    const fee = 0
    const today = new Date()
    if (nextPayment > today) {
      const daysDiff = (today - nextPayment) / 60 / 60 / 24
      fee = parseInt(feeIncrement) * daysDiff
    }
    let total = ethers.BigNumber.from(parseInt(precio) + fee)
    await contract.pagarRenta(id, {value: total}).then(alert("Pago mandado a Metamask, recarge la pagina cuando la transaccion haya sido confirmada."))
  }
  useEffect(() => {
    window.ethereum &&
      window.ethereum.on("chainChanged", () => connect());
      window.ethereum.on("accountsChanged", () => connect());
  });
  
  return (
    <div className="page">
      <Header connect={connect} account={account} network={network} />
      <div className="main">
        {account === ''?
          <Home />
          :
          mainNetwork ?
          <Connected propias={listaPropias} rentando={listaPagando} pagar={pagar} />
          :<div>Para conectarte al contrato cambia a la red "Goerli Testnet"</div>
        }
      </div>
    </div>
  );
}

export default App;
