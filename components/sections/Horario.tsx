'use client';
import { Card, CardContent } from "../../components/ui/card";
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
    <section id="schedule" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-5xl md:text-6xl uppercase">
            {C.schedule.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {C.schedule.subtitle}
          </p>
        </div>
        <Card className="mt-12">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4 font-headline text-xl">{C.schedule.table.time}</TableHead>
                  <TableHead className="w-1/4 font-headline text-xl">{C.schedule.table.monday}</TableHead>
                  <TableHead className="w-1/4 font-headline text-xl">{C.schedule.table.tuesday}</TableHead>
                  <TableHead className="w-1/4 font-headline text-xl">{C.schedule.table.wednesday}</TableHead>
                  <TableHead className="w-1/4 font-headline text-xl">{C.schedule.table.thursday}</TableHead>
                  <TableHead className="w-1/4 font-headline text-xl">{C.schedule.table.friday}</TableHead>
                  <TableHead className="w-1/4 font-headline text-xl">{C.schedule.table.saturday}</TableHead>
                  <TableHead className="w-1/4 font-headline text-xl">{C.schedule.table.sunday}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">18:00 - 19:00</TableCell>
                  <TableCell>{C.schedule.classes[0]}</TableCell>
                  <TableCell>{C.schedule.classes[0]}</TableCell>
                  <TableCell>{C.schedule.classes[0]}</TableCell>
                  <TableCell>{C.schedule.classes[0]}</TableCell>
                  <TableCell>{C.schedule.classes[0]}</TableCell>
                  <TableCell>{C.schedule.classes[0]}</TableCell>
                  <TableCell>{C.schedule.classes[0]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">19:00 - 20:00</TableCell>
                  <TableCell>{C.schedule.classes[1]}</TableCell>
                  <TableCell>{C.schedule.classes[1]}</TableCell>
                  <TableCell>{C.schedule.classes[1]}</TableCell>
                  <TableCell>{C.schedule.classes[1]}</TableCell>
                  <TableCell>{C.schedule.classes[1]}</TableCell>
                  <TableCell>{C.schedule.classes[1]}</TableCell>
                  <TableCell>{C.schedule.classes[1]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">20:00 - 21:00</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">20:00 - 21:00</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">20:00 - 21:00</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                  <TableCell>{C.schedule.classes[2]}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
