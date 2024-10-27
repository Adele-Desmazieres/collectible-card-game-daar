import { Card as CardI } from "@/pokemon/interfaces/card";
import { Container } from '@mui/system'
import { Button, CircularProgress } from '@mui/joy'
import { useEffect, useState } from "react";
import PokemonCard from "./PokemonCard";
import { motion } from 'framer-motion'
import './Booster.css'
import { Wallet } from "../App";
import { getCardById } from "@/pokemon/api";
const logo = "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"

function CardFlip({ cardFront, cardBack, flipped, onClick }: any) {
  return (
    <div className="card-container" onClick={onClick}>
      {/* Front side of the card */}
      <motion.div
        className="card"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 1, ease: [0.6, 0.01, -0.05, 0.95] }}
        style={{ zIndex: flipped ? 0 : 1 }}
      >
        {cardFront}
      </motion.div>

      {/* Back side of the card */}
      <motion.div
        className="card back"
        animate={{ rotateY: flipped ? 360 : 180 }}
        transition={{ duration: 1, ease: [0.6, 0.01, -0.05, 0.95] }}
        style={{ zIndex: flipped ? 1 : 0 }}
      >
        {cardBack}
      </motion.div>
    </div>
  );
};


const listVariants = {
  visible: { transition: { staggerChildren: 0.1 }, },
};

const itemVariants = {
  visible: (custom: { x: number, y: number }) => ({
    x: custom.x,
    y: custom.y,
    transition: { duration: 0.25 },
  }),
};

const shakeVariants = {
  initial: { x: "-50%", y: "50%" },
  shake: {
    x: ['-50%', '-40%', '-60%', '-45%', '-55%', '-45%', '-55%', '-50%'], // Shake effect
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
      times: [0, 0.2, 0.4, 0.6, 0.8, 1, 1, 1], // Timing of the shake
    },
  },
};

export function Booster({ wallet }: { wallet: Wallet }) {
  const [openedCards, setOpenedCards] = useState<string[]>([])
  const [opened, setOpened] = useState<boolean>(false)
  const [isTriggered, setIsTriggered] = useState(false);
  const [cards, setCards] = useState<CardI[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleClick = () => {
    setIsTriggered(true);
    console.log(cards);
    setTimeout(() => {
      setIsTriggered(false);
      setOpened(!opened)
    }, 1100); // Reset state after animations
  };

  useEffect(() => {
    setLoading(true)
    if (!wallet) return
    const adr = wallet?.details.account
    Promise.all([wallet?.contract.getBoostersOf(adr), wallet?.contract.getCollections()])
      .then(([amounts, collections]: [number[], string[]]) => {
        const positiveCollections = collections.filter((_, i) => amounts[i] > 0)
        if (positiveCollections.length === 0) {
          console.error("no booster assigned to your account")
          setError("no booster assigned to your account")
          setLoading(false)
          return
        }
        const rand = Math.floor(Math.random() * positiveCollections.length)
        console.log(rand);
        console.log(positiveCollections[rand]);
        wallet?.contract.openBoosterFromCollection(adr, positiveCollections[rand])
          .then((tx: any) => {
            tx.wait().then((receipt: any) => {
              const event = receipt.events.find((e: any) => e.event === 'BoosterOpened');
              if (event) {
                const cardIds = event.args.cardIds;
                console.log(cardIds);
                Promise.all(cardIds.map((cid: any) => getCardById(cid)))
                  .then((cards: CardI[]) => {
                    console.log(cards)
                    setCards(cards)
                  })
                  .finally(() => setLoading(false));
              }
            });
          });
      })
  }, [wallet])

  return <Container className="mt-32">
    {!opened ?
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: .5 }}
      >
        <motion.div
          className="card-container"
          style={{ left: "50%" }}
          variants={shakeVariants}
          initial="initial"
          animate={isTriggered ? "shake" : "initial"}
        >
          <img src={logo} alt="Blurred Background" className="transition-all" style={{ width: '100%', height: 'auto', filter: isTriggered ? '' : 'blur(8px)' }} />
          {loading
            ? <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: isTriggered ? '0' : '1' }} />
            : error === ""
              ? <Button onClick={handleClick} className="transition-all" style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)', opacity: isTriggered ? '0' : '1'
              }} > Open </Button>
              : <div className="bg-red-400 rounded-md p-5 text-white font-bold" style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'
              }}>
                {error}
              </div>
          }
        </motion.div>
      </motion.div>
      :
      <motion.div
        className="relative"
        initial="visible"
        variants={listVariants}
        style={{ listStyleType: "none", padding: 0 }}
      >
        {cards.map((card, i) =>
          <motion.div
            key={card.id}
            className="absolute"
            variants={itemVariants}
            animate="visible"
            style={{ left: "50%" }}
            initial={{ x: "-50%", y: "50%" }}
            custom={{
              x: opened ? Math.floor(i % 4) * 275 - 550 : 0,
              y: opened ? Math.floor(i / 4) * 375 : 0
            }}
          >
            <CardFlip
              cardFront={<img src={logo} />}
              cardBack={<PokemonCard pokemon={card} />}
              flipped={openedCards.includes(card.id)}
              onClick={() => setOpenedCards([card.id, ...openedCards])}
              i={i}
            />
          </motion.div>
        )}
      </motion.div>
    }
  </Container>
}
