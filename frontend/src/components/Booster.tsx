import { Card as CardI } from "@/pokemon/interfaces/card";
import { Container } from '@mui/system'
import { useState } from "react";
import PokemonCard from "./PokemonCard";
import logo from '../assets/pokemon_card_back.jpg'
import { Card } from "@mui/material";

export function Booster({ cards }: { cards: CardI[] }) {

  const [openedCards, setOpenedCards] = useState<string[]>([])
  const [opened, setOpened] = useState<boolean>(false)

  return <Container className="grid grid-cols-4 gap-5">
    {cards.map(card =>
      <div>
        {openedCards.includes(card.id)
          ? <PokemonCard pokemon={card} key={card.id} />
          : <Card onClick={() => setOpenedCards([card.id, ...openedCards])}>
            <img src={logo} />
            {/* preload images */}
            <link rel="prefetch" href={card.images.large} />
            <link rel="prefetch" href={card.images.small} />
          </Card>
        }
      </div>
    )}
  </Container>
}
