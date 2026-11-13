'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import type { FaqGroup } from '@/data/content'

function FaqGroupBlock({ group }: { group: FaqGroup }) {
  return (
    <div>
      <h3 className="font-serif text-rust text-2xl font-medium">{group.title}</h3>
      <Accordion type="multiple" className="border-foreground/25 mt-3 border-t">
        {group.items.map((item, index) => (
          <AccordionItem key={item.question} value={`${group.id}-${index}`} className="border-foreground/25">
            <AccordionTrigger className="min-h-14 items-center gap-6 rounded-none py-5 text-base leading-snug font-semibold hover:no-underline hover:text-rust data-[state=open]:text-rust">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground max-w-prose pr-8 pb-6 text-base leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export function FaqGroups({ groups }: { groups: FaqGroup[] }) {
  const midpoint = Math.ceil(groups.length / 2)
  const columns = [groups.slice(0, midpoint), groups.slice(midpoint)]

  return (
    <div className="mt-14 grid gap-x-14 gap-y-12 lg:grid-cols-2">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-12">
          {column.map((group) => (
            <FaqGroupBlock key={group.id} group={group} />
          ))}
        </div>
      ))}
    </div>
  )
}
