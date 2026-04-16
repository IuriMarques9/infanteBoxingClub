'use client';
import { CardContent } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";

export default function Schedule() {
  const { language } = useLanguage();
  const C = content[language];

  return (
    <section id="schedule" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-5xl md:text-6xl uppercase tracking-wider">
            {C.schedule.title}
          </h2>
          <div className="section-divider mt-4"></div>
          <p className="mt-6 text-lg text-muted-foreground">
            {C.schedule.subtitle}
          </p>
        </div>
        <div className="card-gold-accent mt-14 bg-card rounded-lg border border-zinc-800 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-center font-headline text-xl text-primary">{C.schedule.table.time}</TableHead>
                  <TableHead className="text-center font-headline text-xl text-primary">{C.schedule.table.monday}</TableHead>
                  <TableHead className="text-center font-headline text-xl text-primary">{C.schedule.table.tuesday}</TableHead>
                  <TableHead className="text-center font-headline text-xl text-primary">{C.schedule.table.wednesday}</TableHead>
                  <TableHead className="text-center font-headline text-xl text-primary">{C.schedule.table.thursday}</TableHead>
                  <TableHead className="text-center font-headline text-xl text-primary">{C.schedule.table.friday}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <TableCell className="text-center font-medium text-foreground">{`18:00 - 19:00`}</TableCell>
                  <TableCell className="text-muted-foreground">{C.schedule.classes[0]} <br /> {C.schedule.classes[6]}</TableCell>
                  <TableCell className="text-muted-foreground">{C.schedule.classes[1]}</TableCell>
                  <TableCell className="text-muted-foreground">{C.schedule.classes[0]} <br /> {C.schedule.classes[6]}</TableCell>
                  <TableCell className="text-muted-foreground">{C.schedule.classes[1]}</TableCell>
                  <TableCell className="text-muted-foreground">{C.schedule.classes[0]} <br /> {C.schedule.classes[6]}</TableCell>
                </TableRow>
                <TableRow className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <TableCell className="text-center font-medium text-foreground">{`19:10 - 20:00`}</TableCell>
                  <TableCell className="text-muted-foreground">{C.schedule.classes[2]}</TableCell>
                  <TableCell className="text-muted-foreground">{C.schedule.classes[3]}</TableCell>
                  <TableCell className="text-muted-foreground">{C.schedule.classes[2]}</TableCell>
                  <TableCell className="text-muted-foreground">{C.schedule.classes[3]}</TableCell>
                  <TableCell className="text-muted-foreground">{C.schedule.classes[2]}</TableCell>
                </TableRow>
                <TableRow className="hover:bg-zinc-800/30">
                  <TableCell className="text-center font-medium text-foreground">{`20:10 - 21:00`}</TableCell>
                  <TableCell className="text-muted-foreground">{C.schedule.classes[3]}</TableCell>
                  <TableCell className="text-muted-foreground">{C.schedule.classes[4]}</TableCell>
                  <TableCell className="text-muted-foreground">{C.schedule.classes[3]}</TableCell>
                  <TableCell className="text-muted-foreground">{C.schedule.classes[4]}</TableCell>
                  <TableCell className="text-muted-foreground">{C.schedule.classes[3]}</TableCell>
                </TableRow>
                
              </TableBody>
            </Table>
          </CardContent>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{C.schedule.observations}</p>
      </div>
    </section>
  );
}
