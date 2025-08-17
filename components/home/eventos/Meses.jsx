import { meses, mesAtual } from "@/data/meses"

export default function Meses () {
   
    return (
        <>
            {
                meses.map(mes => (
                   <div key={mes.mes} className={`flex items-center indent-2`}>
                        <div className="min-w-4 rounded-full bg-[#CCA158] w-4 h-4"></div>
                        
                        {mes.evento 
                            ? 
                            (<h5 className={`${mesAtual == mes && 'underline'}`} >{mes.mes}</h5>) 
                            : 
                            (<h5 className={`${mesAtual == mes && 'underline'} !text-[#EAEAEA]`}>{mes.mes}</h5>)
                        }
                   </div>
                ))
            }
        </>
    )
}


