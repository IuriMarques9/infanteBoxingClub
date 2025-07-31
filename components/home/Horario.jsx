export default function Horario() {

    return (
            <section id="Horario" class="w-full bg-[#CCA158] flex flex-col gap-3 items-start h-fit p-5 md:px-10">  
                <div class="max-w-[1800px] mx-auto bg-white/30 p-6 w-full">
                    <div class="border-b-4 border-[#CCA158] mb-10">
                        <h2 class="!text-white">Horário</h2>
                    </div>

                    <div class="overflow-x-auto overflow-y-hidden">
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
                                    <td class="individuais">Aulas Individuais</td>
                                    <td class="adultos">Adultos Boxe</td>
                                    <td class="individuais">Aulas Individuais</td>
                                    <td class="adultos">Adultos Boxe</td>
                                    <td class="individuais">Aulas Individuais</td>
                                    <td class="competicao">Treino de Competição</td>
                                    <td></td>
                                </tr>

                                <tr>
                                    <td>16:30<br/>17:30</td>
                                    <td></td>
                                    <td class="adultos">Adultos Boxe</td>
                                    <td></td>
                                    <td class="adultos">Adultos Boxe</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>18:00<br/>18:50</td>
                                    <td class="suricatas">Suricatas (6-11 anos)</td>
                                    <td class="gatinhos">Gatinhos (6-7 anos)<br/>Women's Class</td>
                                    <td class="suricatas">Suricatas (6-11 anos)</td>
                                    <td class="gatinhos">Gatinhos (6-7 anos)<br/>Women's Class</td>
                                    <td class="suricatas">Suricatas (6-11 anos)</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>19:00<br/>19:50</td>
                                    <td class="leoes">Leões (12-14 anos)</td>
                                    <td class="adultos">Adultos Boxe</td>
                                    <td class="leoes">Leões (12-14 anos)</td>
                                    <td class="adultos">Adultos Boxe</td>
                                    <td class="leoes">Leões (12-14 anos)</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>20:00<br/>21:00</td>
                                    <td class="adultos">Adultos Boxe</td>
                                    <td class="jiujitsu">Jiu-Jitsu</td>
                                    <td class="adultos">Adultos Boxe</td>
                                    <td class="jiujitsu">Jiu-Jitsu</td>
                                    <td class="adultos">Adultos Boxe</td>
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