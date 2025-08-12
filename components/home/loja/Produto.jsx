import Image from "next/image";
export default function Produto(props) {
    // This component will display individual product details

    return (
            <div className="rounded-sm w-full md:min-w-1/3 shadow-[inset_0px_0px_50px_35px_rgba(204,_161,_88,_100)] p-5">
                {/* Product details will be displayed here */}
                <Image src={props.url} alt={props.id} width={props.width} height={props.height} />

                <h4 className="!text-white">{props.context?.caption || "Sem titulo"}</h4>
                <p className="!text-white">{props.context?.Preço || "0,00€"}</p>
            </div>
    );
}