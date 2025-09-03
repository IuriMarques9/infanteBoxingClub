export default function Horario() {

    return (
            <section id="Horario" className="w-full bg-[#CCA158] flex flex-col gap-3 items-start h-fit p-5 md:px-10">  
                <div className="max-w-[1800px] mx-auto bg-white/30 p-6 w-full">
                    <div className="border-b-4 border-[#CCA158] mb-10 w-fit pr-20">
                        <h2 className="!text-white">Horário</h2>
                    </div>

                    <div className="overflow-x-auto overflow-y-hidden mb-10">
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
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>10:00<br/>12:30</td>
                                    <td></td>
                                    <td className="livre">Acesso Livre</td>
                                    <td></td>
                                    <td className="livre">Acesso Livre</td>
                                    <td></td>
                                    <td className="competicao">Treino de Competição</td>
                                </tr>

                                <tr>
                                    <td>16:30<br/>17:30</td>
                                    <td></td>
                                    <td className="adultos">Adultos Boxe</td>
                                    <td></td>
                                    <td className="adultos">Adultos Boxe</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>18:00<br/>19:00</td>
                                    <td className="suricatas">Suricatas (6-11 anos)</td>
                                    <td className="gatinhos">Gatinhos (6-7 anos)<br/>Women's class</td>
                                    <td className="suricatas">Suricatas (6-11 anos)</td>
                                    <td className="gatinhos">Gatinhos (6-7 anos)<br/>Women's class</td>
                                    <td className="suricatas">Suricatas (6-11 anos)</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>19:00<br/>20:00</td>
                                    <td className="leoes">Leões (12-14 anos)</td>
                                    <td className="adultos">Adultos Boxe</td>
                                    <td className="leoes">Leões (12-14 anos)</td>
                                    <td className="adultos">Adultos Boxe</td>
                                    <td className="leoes">Leões (12-14 anos)</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>20:00<br/>21:00</td>
                                    <td className="adultos">Adultos Boxe</td>
                                    <td></td>
                                    <td className="adultos">Adultos Boxe</td>
                                    <td></td>
                                    <td className="adultos">Adultos Boxe</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
    );
}