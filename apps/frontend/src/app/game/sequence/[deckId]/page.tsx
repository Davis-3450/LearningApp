// @ts-nocheck
"use client";

import { scienceDeck } from "../../../../../../shared/data/decks/science-deck";
import { Card } from "../../../../../../shared/schemas/cards";
import { useMemo, useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from "./_components/sortable-item";


export default function SequenceGamePage({ params }: { params: { deckId: string } }) {
  // NOTE: For now, we are using a mock deck.
  // In the future, you would fetch the deck based on params.deckId
  const deck = scienceDeck;

  const orderingCards = useMemo(
    () => deck.cards.filter((card: Card) => card.cardType === "ordering"),
    [deck]
  );

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const activeCard = orderingCards[activeCardIndex] as Extract<Card, { cardType: 'ordering' }>;

  const [items, setItems] = useState(activeCard.data.items);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((currentItems: string[]) => {
        const oldIndex = currentItems.indexOf(active.id as string);
        const newIndex = currentItems.indexOf(over.id as string);
        return arrayMove(currentItems, oldIndex, newIndex);
      });
    }
  }

  // TODO: Add logic to check if the order is correct and move to the next card.

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">{deck.title}</h1>
        <h2 className="text-lg text-center text-gray-600 mb-8">{activeCard.data.instruction}</h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {items.map((item: string) => <SortableItem key={item} id={item} />)}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
} 