import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/Retro-style-accordion";
import faqQuestions from "../../utils/shapes/faqQuestions";

export default function FaqAccordion() {
  return (
    <Accordion defaultValue="item-1" className="w-full max-w-md">
      {faqQuestions?.map((question) => (
        <AccordionItem value={question?.value} key={question?.value}>
          <AccordionTrigger>{question?.question}</AccordionTrigger>
          <AccordionContent>
            <p className="p-4 text-[#4A6DA7]">{question?.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
