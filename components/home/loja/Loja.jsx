"use client";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import Produto from "./Produto";
import { Swiper, SwiperSlide } from 'swiper/react'; 
import { Autoplay } from 'swiper/modules'; // Importe o módulo Autoplay

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
            <div className="border-b-4 border-[#CCA158] w-fit pr-20">
                <h2>Loja Infante</h2>
            </div>

            <div className="flex flex-wrap items-stretch overflow-hidden bg-[#CCA158]/30 p-6">

                <Swiper 
                    modules={[Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    autoplay={{ delay: 1000, pauseOnMouseEnter: true}}
                    loop={true}
                    speed={1000}
                    onSwiper={(swiper) => console.log(swiper)}
                    breakpoints={{
                        768: {
                            slidesPerView: 3,
                        }
                    }}
                    className="mySwiper"
                >
                    {!produtos.length && <LoaderCircle className="col-start-3 animate-spin text-[#CCA158] w-10 h-10 mx-auto mt-20" /> }{/*Loader dos produtos*/}
                    {
                        produtos.map(prod => (
                            <SwiperSlide>
                                <Produto key={prod.id} id={prod.id} url={prod.url} width={prod.width} height={prod.height} context={prod.context} />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div> 
        </section>
    );
}