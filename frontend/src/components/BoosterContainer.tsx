import { Booster } from './Booster'

export function BoosterContainer() {
  let cards : any =
    [
      {
        id: 'ex7-2',
        name: 'Dark Ampharos',
        supertype: 'Pokémon',
        subtypes: ['Stage 2'],
        hp: '120',
        types: ['Lightning', 'Darkness'],
        evolvesFrom: 'Dark Flaaffy',
        rules: ['This Pokémon is both Lightning Darkness type.'],
        abilities: [[Object]],
        attacks: [[Object], [Object]],
        weaknesses: [[Object]],
        retreatCost: ['Colorless', 'Colorless'],
        convertedRetreatCost: 2,
        set: {
          id: 'ex7',
          name: 'Team Rocket Returns',
          series: 'EX',
          printedTotal: 109,
          total: 111,
          legalities: [Object],
          ptcgoCode: 'TRR',
          releaseDate: '2004/11/01',
          updatedAt: '2019/01/28 16:44:00',
          images: [Object]
        },
        number: '2',
        artist: 'Emi Miwa',
        rarity: 'Rare Holo',
        nationalPokedexNumbers: [181],
        legalities: { unlimited: 'Legal' },
        images: {
          small: 'https://images.pokemontcg.io/ex7/2.png',
          large: 'https://images.pokemontcg.io/ex7/2_hires.png'
        },
        tcgplayer: {
          url: 'https://prices.pokemontcg.io/tcgplayer/ex7-2',
          updatedAt: '2024/10/23',
          prices: [Object]
        },
        cardmarket: {
          url: 'https://prices.pokemontcg.io/cardmarket/ex7-2',
          updatedAt: '2024/10/23',
          prices: [Object]
        }
      },
      {
        id: 'ex7-3',
        name: 'Dark Crobat',
        supertype: 'Pokémon',
        subtypes: ['Stage 2'],
        hp: '90',
        types: ['Grass', 'Darkness'],
        evolvesFrom: 'Dark Golbat',
        rules: ['This Pokémon is both Grass Darkness type.'],
        abilities: [[Object]],
        attacks: [[Object], [Object]],
        weaknesses: [[Object]],
        resistances: [[Object]],
        retreatCost: ['Colorless'],
        convertedRetreatCost: 1,
        set: {
          id: 'ex7',
          name: 'Team Rocket Returns',
          series: 'EX',
          printedTotal: 109,
          total: 111,
          legalities: [Object],
          ptcgoCode: 'TRR',
          releaseDate: '2004/11/01',
          updatedAt: '2019/01/28 16:44:00',
          images: [Object]
        },
        number: '3',
        artist: 'Kyoko Koizumi',
        rarity: 'Rare Holo',
        nationalPokedexNumbers: [169],
        legalities: { unlimited: 'Legal' },
        images: {
          small: 'https://images.pokemontcg.io/ex7/3.png',
          large: 'https://images.pokemontcg.io/ex7/3_hires.png'
        },
        tcgplayer: {
          url: 'https://prices.pokemontcg.io/tcgplayer/ex7-3',
          updatedAt: '2024/10/23',
          prices: [Object]
        },
        cardmarket: {
          url: 'https://prices.pokemontcg.io/cardmarket/ex7-3',
          updatedAt: '2024/10/23',
          prices: [Object]
        }
      },
      {
        id: 'base5-1',
        name: 'Dark Alakazam',
        supertype: 'Pokémon',
        subtypes: ['Stage 2'],
        level: '30',
        hp: '60',
        types: ['Psychic'],
        evolvesFrom: 'Dark Kadabra',
        attacks: [[Object], [Object]],
        weaknesses: [[Object]],
        retreatCost: ['Colorless', 'Colorless', 'Colorless'],
        convertedRetreatCost: 3,
        set: {
          id: 'base5',
          name: 'Team Rocket',
          series: 'Base',
          printedTotal: 82,
          total: 83,
          legalities: [Object],
          ptcgoCode: 'TR',
          releaseDate: '2000/04/24',
          updatedAt: '2020/08/14 09:35:00',
          images: [Object]
        },
        number: '1',
        artist: 'Ken Sugimori',
        rarity: 'Rare Holo',
        flavorText: 'Almost as if it were being controlled by something else, it never changes expressions, even in the middle of battle.',
        nationalPokedexNumbers: [65],
        legalities: { unlimited: 'Legal' },
        images: {
          small: 'https://images.pokemontcg.io/base5/1.png',
          large: 'https://images.pokemontcg.io/base5/1_hires.png'
        },
        tcgplayer: {
          url: 'https://prices.pokemontcg.io/tcgplayer/base5-1',
          updatedAt: '2024/10/23',
          prices: [Object]
        },
        cardmarket: {
          url: 'https://prices.pokemontcg.io/cardmarket/base5-1',
          updatedAt: '2024/10/23',
          prices: [Object]
        }
      },
      {
        id: 'neo4-1',
        name: 'Dark Ampharos',
        supertype: 'Pokémon',
        subtypes: ['Stage 2'],
        level: '36',
        hp: '70',
        types: ['Lightning'],
        evolvesFrom: 'Dark Flaaffy',
        abilities: [[Object]],
        attacks: [[Object]],
        weaknesses: [[Object]],
        retreatCost: ['Colorless', 'Colorless'],
        convertedRetreatCost: 2,
        set: {
          id: 'neo4',
          name: 'Neo Destiny',
          series: 'Neo',
          printedTotal: 105,
          total: 113,
          legalities: [Object],
          ptcgoCode: 'N4',
          releaseDate: '2002/02/28',
          updatedAt: '2020/09/25 10:09:00',
          images: [Object]
        },
        number: '1',
        artist: 'Kagemaru Himeno',
        rarity: 'Rare Holo',
        flavorText: 'Its brightly lit tail can be seen for miles in the dark, even by ships on the sea.',
        nationalPokedexNumbers: [181],
        legalities: { unlimited: 'Legal' },
        images: {
          small: 'https://images.pokemontcg.io/neo4/1.png',
          large: 'https://images.pokemontcg.io/neo4/1_hires.png'
        },
        tcgplayer: {
          url: 'https://prices.pokemontcg.io/tcgplayer/neo4-1',
          updatedAt: '2024/10/23',
          prices: [Object]
        },
        cardmarket: {
          url: 'https://prices.pokemontcg.io/cardmarket/neo4-1',
          updatedAt: '2024/10/23',
          prices: [Object]
        }
      },
      {
        id: 'base5-2',
        name: 'Dark Arbok',
        supertype: 'Pokémon',
        subtypes: ['Stage 1'],
        level: '25',
        hp: '60',
        types: ['Grass'],
        evolvesFrom: 'Ekans',
        attacks: [[Object], [Object]],
        weaknesses: [[Object]],
        retreatCost: ['Colorless', 'Colorless'],
        convertedRetreatCost: 2,
        set: {
          id: 'base5',
          name: 'Team Rocket',
          series: 'Base',
          printedTotal: 82,
          total: 83,
          legalities: [Object],
          ptcgoCode: 'TR',
          releaseDate: '2000/04/24',
          updatedAt: '2020/08/14 09:35:00',
          images: [Object]
        },
        number: '2',
        artist: 'Mitsuhiro Arita',
        rarity: 'Rare Holo',
        flavorText: 'Freezes its prey with its stare. If you should encounter one, remember not to look into its eyes.',
        nationalPokedexNumbers: [24],
        legalities: { unlimited: 'Legal' },
        images: {
          small: 'https://images.pokemontcg.io/base5/2.png',
          large: 'https://images.pokemontcg.io/base5/2_hires.png'
        },
        tcgplayer: {
          url: 'https://prices.pokemontcg.io/tcgplayer/base5-2',
          updatedAt: '2024/10/23',
          prices: [Object]
        },
        cardmarket: {
          url: 'https://prices.pokemontcg.io/cardmarket/base5-2',
          updatedAt: '2024/10/23',
          prices: [Object]
        }
      },
      {
        id: 'neo4-2',
        name: 'Dark Crobat',
        supertype: 'Pokémon',
        subtypes: ['Stage 2'],
        level: '39',
        hp: '70',
        types: ['Grass'],
        evolvesFrom: 'Dark Golbat',
        abilities: [[Object]],
        attacks: [[Object]],
        weaknesses: [[Object]],
        resistances: [[Object]],
        set: {
          id: 'neo4',
          name: 'Neo Destiny',
          series: 'Neo',
          printedTotal: 105,
          total: 113,
          legalities: [Object],
          ptcgoCode: 'N4',
          releaseDate: '2002/02/28',
          updatedAt: '2020/09/25 10:09:00',
          images: [Object]
        },
        number: '2',
        artist: 'Shin-ichi Yoshikawa, CR CG gangs',
        rarity: 'Rare Holo',
        flavorText: 'Although the wings it has evolved on its feet allow it to fly at high speeds, they unfortunately make it difficult to perch.',
        nationalPokedexNumbers: [169],
        legalities: { unlimited: 'Legal' },
        images: {
          small: 'https://images.pokemontcg.io/neo4/2.png',
          large: 'https://images.pokemontcg.io/neo4/2_hires.png'
        },
        tcgplayer: {
          url: 'https://prices.pokemontcg.io/tcgplayer/neo4-2',
          updatedAt: '2024/10/23',
          prices: [Object]
        },
        cardmarket: {
          url: 'https://prices.pokemontcg.io/cardmarket/neo4-2',
          updatedAt: '2024/10/23',
          prices: [Object]
        }
      },
      {
        id: 'ex7-4',
        name: 'Dark Electrode',
        supertype: 'Pokémon',
        subtypes: ['Stage 1'],
        hp: '70',
        types: ['Lightning', 'Darkness'],
        evolvesFrom: 'Voltorb',
        rules: ['This Pokémon is both Lightning Darkness type.'],
        abilities: [[Object]],
        attacks: [[Object]],
        weaknesses: [[Object]],
        retreatCost: ['Colorless'],
        convertedRetreatCost: 1,
        set: {
          id: 'ex7',
          name: 'Team Rocket Returns',
          series: 'EX',
          printedTotal: 109,
          total: 111,
          legalities: [Object],
          ptcgoCode: 'TRR',
          releaseDate: '2004/11/01',
          updatedAt: '2019/01/28 16:44:00',
          images: [Object]
        },
        number: '4',
        artist: 'Kouki Saitou',
        rarity: 'Rare Holo',
        nationalPokedexNumbers: [101],
        legalities: { unlimited: 'Legal' },
        images: {
          small: 'https://images.pokemontcg.io/ex7/4.png',
          large: 'https://images.pokemontcg.io/ex7/4_hires.png'
        },
        tcgplayer: {
          url: 'https://prices.pokemontcg.io/tcgplayer/ex7-4',
          updatedAt: '2024/10/23',
          prices: [Object]
        },
        cardmarket: {
          url: 'https://prices.pokemontcg.io/cardmarket/ex7-4',
          updatedAt: '2024/10/23',
          prices: [Object]
        }
      },
      {
        id: 'dp4-3',
        name: 'Darkrai',
        supertype: 'Pokémon',
        subtypes: ['Basic'],
        level: '38',
        hp: '70',
        types: ['Darkness'],
        attacks: [[Object], [Object]],
        weaknesses: [[Object]],
        resistances: [[Object]],
        retreatCost: ['Colorless'],
        convertedRetreatCost: 1,
        set: {
          id: 'dp4',
          name: 'Great Encounters',
          series: 'Diamond & Pearl',
          printedTotal: 106,
          total: 106,
          legalities: [Object],
          ptcgoCode: 'GE',
          releaseDate: '2008/02/01',
          updatedAt: '2018/03/04 10:35:00',
          images: [Object]
        },
        number: '3',
        artist: 'Masakazu Fukuda',
        rarity: 'Rare Holo',
        flavorText: 'It can lull people to sleep and make them dream. It is active during nights of the new moon.',
        nationalPokedexNumbers: [491],
        legalities: { unlimited: 'Legal' },
        images: {
          small: 'https://images.pokemontcg.io/dp4/3.png',
          large: 'https://images.pokemontcg.io/dp4/3_hires.png'
        },
        tcgplayer: {
          url: 'https://prices.pokemontcg.io/tcgplayer/dp4-3',
          updatedAt: '2024/10/23',
          prices: [Object]
        },
        cardmarket: {
          url: 'https://prices.pokemontcg.io/cardmarket/dp4-3',
          updatedAt: '2024/10/23',
          prices: [Object]
        }
      }
    ]
  return <Booster cards={cards} />
}
