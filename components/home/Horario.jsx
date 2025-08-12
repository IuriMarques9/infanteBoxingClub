export default function Horario() {

    return (
            <section id="Horario" className="w-full bg-[#CCA158] flex flex-col gap-3 items-start h-fit p-5 md:px-10">  
                <div className="max-w-[1800px] mx-auto bg-white/30 p-6 w-full">
                    <div className="border-b-4 border-[#CCA158] mb-10">
                        <h2 className="!text-white">Horário</h2>
                    </div>

                    <div className="overflow-x-auto overflow-y-hidden">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Segunda</th>
                                    <th>Terça</th>
                                    <th>Quarta</th>
                                    <th>Quinta</th>
                                    <th>Sexta</th>
                                    <th>Sábado</th>
                                    <th>Domingo</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>09:00<br/>10:00</td>
                                    <td className="individuais">Aulas Individuais</td>
                                    <td className="adultos">Adultos Boxe</td>
                                    <td className="individuais">Aulas Individuais</td>
                                    <td className="adultos">Adultos Boxe</td>
                                    <td className="individuais">Aulas Individuais</td>
                                    <td className="competicao">Treino de Competição</td>
                                    <td></td>
                                </tr>

                                <tr>
                                    <td>16:30<br/>17:30</td>
                                    <td></td>
                                    <td className="adultos">Adultos Boxe</td>
                                    <td></td>
                                    <td className="adultos">Adultos Boxe</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>18:00<br/>18:50</td>
                                    <td className="suricatas">Suricatas (6-11 anos)</td>
                                    <td className="gatinhos">Gatinhos (6-7 anos)<br/>Women's className</td>
                                    <td className="suricatas">Suricatas (6-11 anos)</td>
                                    <td className="gatinhos">Gatinhos (6-7 anos)<br/>Women's className</td>
                                    <td className="suricatas">Suricatas (6-11 anos)</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>19:00<br/>19:50</td>
                                    <td className="leoes">Leões (12-14 anos)</td>
                                    <td className="adultos">Adultos Boxe</td>
                                    <td className="leoes">Leões (12-14 anos)</td>
                                    <td className="adultos">Adultos Boxe</td>
                                    <td className="leoes">Leões (12-14 anos)</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>20:00<br/>21:00</td>
                                    <td className="adultos">Adultos Boxe</td>
                                    <td className="jiujitsu">Jiu-Jitsu</td>
                                    <td className="adultos">Adultos Boxe</td>
                                    <td className="jiujitsu">Jiu-Jitsu</td>
                                    <td className="adultos">Adultos Boxe</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
    );
}