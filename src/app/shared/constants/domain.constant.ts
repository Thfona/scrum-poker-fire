import { DomainInterface } from '../interfaces/domain-interface';

export const DOMAIN: DomainInterface = {
  cardSetOptions: [
    {
      name: 'FIBONACCI',
      cards: [
        {
          displayValue: '0',
          value: 0
        },
        {
          displayValue: '1',
          value: 1
        },
        {
          displayValue: '2',
          value: 2
        },
        {
          displayValue: '3',
          value: 3
        },
        {
          displayValue: '5',
          value: 5
        },
        {
          displayValue: '8',
          value: 8
        },
        {
          displayValue: '13',
          value: 13
        },
        {
          displayValue: '21',
          value: 21
        },
        {
          displayValue: '34',
          value: 34
        },
        {
          displayValue: '55',
          value: 55
        },
        {
          displayValue: '89',
          value: 89
        }
      ]
    },
    {
      name: 'MODIFIED_FIBONACCI',
      cards: [
        {
          displayValue: '0',
          value: 0
        },
        {
          displayValue: '½',
          value: 0.5
        },
        {
          displayValue: '1',
          value: 1
        },
        {
          displayValue: '2',
          value: 2
        },
        {
          displayValue: '3',
          value: 3
        },
        {
          displayValue: '5',
          value: 5
        },
        {
          displayValue: '8',
          value: 8
        },
        {
          displayValue: '13',
          value: 13
        },
        {
          displayValue: '20',
          value: 20
        },
        {
          displayValue: '40',
          value: 40
        },
        {
          displayValue: '100',
          value: 100
        }
      ]
    },
    {
      name: 'POWERS_OF_2',
      cards: [
        {
          displayValue: '0',
          value: 0
        },
        {
          displayValue: '1',
          value: 1
        },
        {
          displayValue: '2',
          value: 2
        },
        {
          displayValue: '4',
          value: 4
        },
        {
          displayValue: '8',
          value: 8
        },
        {
          displayValue: '16',
          value: 16
        },
        {
          displayValue: '32',
          value: 32
        },
        {
          displayValue: '64',
          value: 64
        }
      ]
    },
    {
      name: 'SHIRT_SIZES',
      cards: [
        {
          displayValue: 'XXS',
          value: 1
        },
        {
          displayValue: 'XS',
          value: 3
        },
        {
          displayValue: 'S',
          value: 8
        },
        {
          displayValue: 'M',
          value: 13
        },
        {
          displayValue: 'L',
          value: 20
        },
        {
          displayValue: 'XL',
          value: 40
        },
        {
          displayValue: 'XXL',
          value: 100
        }
      ]
    }
  ],
  defaultGameSettings: {
    allowVoteChangeAfterReveal: false,
    autoFlip: false,
    calculateScore: true,
    cardSet: 'FIBONACCI',
    isPrivate: false,
    shareVelocity: false,
    storyTimer: false,
    storyTimerMinutes: 1,
    teamVelocity: 0
  },
  voteSkipOptions: [
    {
      displayValue: '?'
    },
    {
      displayValue: 'PASS_CARD'
    }
  ]
};
