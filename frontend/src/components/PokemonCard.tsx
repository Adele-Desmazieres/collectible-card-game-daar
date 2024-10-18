import { Card } from '../pokemon/interfaces/card'

type PokemonCardProps = {
  pokemon: Card
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <div className="color">
      <div className="">
        <h2>{pokemon.name}</h2>
      </div>
      <img
        src={pokemon.images?.large}
        alt={pokemon.name}
        className="pokemon-image"
      />
    </div>
  );
};

export default PokemonCard;
