import { Card, Modal, ModalDialog, Table } from '@mui/joy';
import { CardMedia } from '@mui/material';
import { useState } from 'react';
import { Card as CardI } from '../pokemon/interfaces/card'
import { Transition } from 'react-transition-group';

type PokemonCardProps = {
  pokemon: CardI
}

enum Size { LARGE, SMALL }

function Info({ pokemon, size }: { pokemon: CardI, size: Size }) {
  return (
    <CardMedia
      component='img'
      sx={{ maxWidth: 400 }}
      image={size == Size.SMALL ? pokemon.images?.small : pokemon.images?.large}
      title={pokemon.name}
      alt={pokemon.name}
    />
  )
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const [focused, setFocused] = useState(false);
  function getResistances() {
    let r = ""
    if (!pokemon.resistances){
      return r
    }
    for (const res of pokemon.resistances) {
      r += `${res.type}=${res.value}, `
    }
    return r
  }
  function getAbilities() {
    let r = ""
    if (!pokemon.abilities){
      return r
    }
    for (const res of pokemon.abilities) {
      r += `${res.name}:${res.type}\n`
    }
    return r
  }

  return (
    <Card onClick={() => setFocused(!focused)} >
      <Info pokemon={pokemon} size={Size.SMALL} />

      <Transition in={focused} timeout={400}>
        {(state: string) => (
          <Modal
            keepMounted
            open={!['exited', 'exiting'].includes(state)}
            onClose={() => setFocused(false)}
            slotProps={{
              backdrop: {
                sx: {
                  opacity: 0,
                  backdropFilter: 'none',
                  transition: `opacity 400ms, backdrop-filter 400ms`,
                  ...{
                    entering: { opacity: 1, backdropFilter: 'blur(8px)' },
                    entered: { opacity: 1, backdropFilter: 'blur(8px)' },
                  }[state],
                },
              },
            }}
            sx={[
              state === 'exited'
                ? { visibility: 'hidden' }
                : { visibility: 'visible' },
            ]}
          >
            <ModalDialog
              sx={{
                opacity: 0,
                transition: `opacity 300ms`,
                ...{
                  entering: { opacity: 1 },
                  entered: { opacity: 1 },
                }[state],
              }}
            >
              <Card orientation="horizontal" >
                <Info pokemon={pokemon} size={Size.LARGE} />
                <Table>
                  <tbody>
                    <tr>
                      <td>Name: </td>
                      <td>{pokemon.name}</td>
                    </tr>
                    <tr>
                      <td>Hp: </td>
                      <td>{pokemon.hp}</td>
                    </tr>
                    <tr>
                      <td>Types: </td>
                      <td>{pokemon.types}</td>
                    </tr>
                    <tr>
                      <td>Rarity: </td>
                      <td>{pokemon.rarity}</td>
                    </tr>
                    <tr>
                      <td>Resistences: </td>
                      <td>{getResistances()}</td>
                    </tr>
                    <tr>
                      <td>Abilities: </td>
                      <td>{getAbilities()}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </ModalDialog>
          </Modal>
        )}
      </Transition>
    </Card>
  );
};

export default PokemonCard;
