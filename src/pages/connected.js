import { ethers } from "ethers";
import "../App.css";

export default function Connected({propias, rentando, pagar}) {

    const calcularDias = (nextPayment) => {
        const today = Math.floor(Date.now() / 1000)
        let daysDiff = 0
        if (nextPayment < today) {
            daysDiff = Math.floor((today - (nextPayment)) / 60 / 60 / 24)
        }
        return daysDiff
    }
    const HouseOwner = () => {
        return (
            <>
                <div>Tus Propiedades:</div>
                {propias.map(casa => (
                    <div key={casa.id} className="casaInfo">
                        <p>Casa {ethers.utils.formatUnits(casa.id,0)}</p>
                        <p>Pagar antes del {new Date(parseInt(ethers.utils.formatUnits(casa.nextPayment,0) * 1000)).toLocaleDateString()}</p>
                        <p>Precio {ethers.utils.formatEther(casa.precio)} ETH</p>
                        <p>Cargo por pago tardio {ethers.utils.formatEther(casa.feeIncrement)} ETH x dia</p>
                        <p>Rentado desde el {new Date(parseInt(ethers.utils.formatUnits(casa.startDate,0) * 1000)).toLocaleDateString()}</p>
                    </div>
                ))}
            </>
        )
    }
    const Rentando = () => {
        return (
            <>
                <div>Estas Pagando:</div>
                {rentando.map(casa => (
                    <div key={casa.id} className="casaInfo">
                        <p>Casa {ethers.utils.formatUnits(casa.id,0)}</p>
                        <p>Precio {ethers.utils.formatEther(casa.precio)} ETH</p>
                        <p>Pagar antes del {new Date(parseInt(ethers.utils.formatUnits(casa.nextPayment,0) * 1000)).toLocaleDateString()}</p>
                        <p>Dias de atraso = {calcularDias(ethers.utils.formatUnits(casa.nextPayment,0))}</p>
                        <p>Cargo por pago tardio {ethers.utils.formatEther(casa.feeIncrement)} ETH x dia</p>
                        <p>Rentado desde el {new Date(parseInt(ethers.utils.formatUnits(casa.startDate,0) * 1000)).toLocaleDateString()}</p>
                        <button onClick={()=>pagar(
                            ethers.utils.formatUnits(casa.precio,0),  
                            ethers.utils.formatUnits(casa.feeIncrement,0),
                            calcularDias(ethers.utils.formatUnits(casa.nextPayment,0)), 
                            ethers.utils.formatUnits(casa.id,0)
                        )}>Pagar</button>
                    </div>
                ))}
            </>
        )
    }
    return (
        <div>
            {propias.length > 0 ? HouseOwner()
            :
            <div className="info">Actualmente no eres Arrendador</div>}   
            {rentando.length > 0 ? Rentando()
            :
            null}              
        </div>
    )
}
