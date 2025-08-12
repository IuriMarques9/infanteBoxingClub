"use client";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import Produto from "./Produto";

export default function Loja() {
    // This component will render the products available in the store
    const [produtos, setProdutos] = useState([]);// Estado para guardar imagens
   
    useEffect(() => {
            fetch('api/cloudinaryImages/produtos')
                .then(res => res.json())
                .then(data => setProdutos(data))
                .catch(err => console.error("Failed to fetch products:", err));
        }, []);

    

    return (
        <section id="Loja" className="max-w-[1800px] mx-auto h-fit p-5 md:px-10 flex flex-col gap-15">
            <div className="border-b-4 border-[#CCA158]">
                <h2>Loja Infante</h2>
            </div>

            <div className="flex flex-col md:flex-row overflow-hidden items-center gap-5 bg-[#CCA158]/30 p-6">
                    
                {!produtos.length && <LoaderCircle className="col-start-3 animate-spin text-[#CCA158] w-10 h-10 mx-auto mt-20" /> }{/*Loader dos produtos*/}
                {
                    produtos.map(prod => (
                        <Produto key={prod.id} id={prod.id} url={prod.url} width={prod.width} height={prod.height} context={prod.context} />
                    ))
                }
            </div> 
        </section>
    );
}