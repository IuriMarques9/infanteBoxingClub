import SectionShell from "../shared/SectionShell";
import ProximoEvento from "../sections/eventos/ProximoEvento";
import EventosFuturos from "../sections/eventos/EventosFuturos";

export default function Eventos() {
  return (
    <SectionShell id="events" surface="default">
      <ProximoEvento />
      <EventosFuturos />
    </SectionShell>
  );
}
