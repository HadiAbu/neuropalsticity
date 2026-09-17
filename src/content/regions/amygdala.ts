import type { ThreatContent } from '@content/schema';

const amygdala: ThreatContent = {
  kind: 'threat',
  id: 'amygdala',
  name: 'Amygdala',
  plainName: 'the amygdala',
  overview:
    'Two almond-shaped clusters buried deep in the temporal lobes, one on each side. They ' +
    'tag what matters — above all, what might hurt you — and set the body moving before ' +
    'you have finished noticing.',
  insight:
    'Fear is not a flaw to be engineered away. It is a fast, ancient system that keeps you ' +
    'at a safe distance from snakes, strangers and cliff edges without asking permission. ' +
    'Take it away and the world does not become braver. It becomes indifferent to danger.',
  premise:
    'In this level both amygdalae are damaged. The real cases are almost always bilateral: ' +
    'the rare genetic condition that destroys the amygdala, Urbach–Wiethe disease, ' +
    'calcifies both sides. With one side intact, the other largely covers for it.',
  stimuli: [
    {
      id: 'snake',
      label: 'A live snake, within reach',
      description:
        'At an exotic pet shop, a handler holds out a large snake and asks whether you would ' +
        'like to touch it.',
      choices: [
        { id: 'freeze', label: 'Freezes, heart racing, backs away', correct: false },
        { id: 'calm', label: 'Leans in, touches it, asks to hold it', correct: true },
        { id: 'panic', label: 'Screams and leaves the shop', correct: false },
        { id: 'wary', label: 'Stays put but refuses to touch it', correct: false },
      ],
      intact: {
        heartRateBpm: 118,
        sweat: 'strong',
        behavior: 'Steps back, arms in, eyes locked on the snake',
        report: '"Absolutely not."',
      },
      damaged: {
        heartRateBpm: 74,
        sweat: 'none',
        behavior: 'Steps closer, strokes the scales, asks to hold it',
        report: '"It feels amazing. Can I hold the bigger one?"',
      },
      explanation:
        'The amygdala is what turns "large snake" into "danger" fast enough to move you. ' +
        'Without it, the snake is simply interesting. Patient S.M. handled snakes and ' +
        'tarantulas at a pet store with open curiosity and had to be stopped from touching ' +
        'the venomous ones, all while knowing, and saying, that snakes can be dangerous.',
      dayToDay:
        'Knowing something is dangerous and feeling that it is turn out to be different ' +
        'things. The knowledge survives. The feeling that would keep you at arm\'s length ' +
        'does not.',
      sources: [
        {
          claim:
            'Bilateral amygdala damage abolishes fear responses to snakes and spiders while ' +
            'leaving knowledge of their danger intact.',
          citation: 'Feinstein, Adolphs, Damasio & Tranel (2011), Current Biology',
          url: 'https://doi.org/10.1016/j.cub.2010.11.042',
        },
      ],
    },
    {
      id: 'fearful-face',
      label: 'A face showing fear',
      description:
        'Someone across the room looks at you with wide eyes, raised brows and a slightly ' +
        'open mouth.',
      choices: [
        { id: 'reads', label: 'Reads it instantly and looks for the threat', correct: false },
        { id: 'misreads', label: 'Sees the face clearly but cannot say what it feels', correct: true },
        { id: 'mirrors', label: 'Feels a jolt of fear themselves', correct: false },
        { id: 'blind', label: 'Cannot recognise the face at all', correct: false },
      ],
      intact: {
        heartRateBpm: 88,
        sweat: 'mild',
        behavior: 'Turns to look where the other person is looking',
        report: '"Something\'s wrong. What did they see?"',
        fearRecognized: true,
      },
      damaged: {
        heartRateBpm: 72,
        sweat: 'none',
        behavior: 'Keeps talking; nothing about the face registers as alarming',
        report: '"Surprised, maybe? I honestly can\'t tell."',
        fearRecognized: false,
      },
      explanation:
        'The amygdala guides where we look on a face, especially the eyes, where fear shows ' +
        'most. Without it, people still recognise happiness, sadness and anger well, but ' +
        'fear specifically becomes hard to name. S.M. rated fearful faces as far less ' +
        'intense than others do, and when asked to draw fear produced an almost blank face.',
      dayToDay:
        'A room can be frightened and you would be the last to know. Other people\'s alarm ' +
        'stops being contagious, which is exactly what it is meant to be.',
      sources: [
        {
          claim: 'Bilateral amygdala damage selectively impairs recognition of fear in facial expressions.',
          citation: 'Adolphs, Tranel, Damasio & Damasio (1994), Nature',
          url: 'https://doi.org/10.1038/372669a0',
        },
        {
          claim: 'The impairment stems from failing to look at the eye region of faces.',
          citation: 'Adolphs et al. (2005), Nature',
          url: 'https://doi.org/10.1038/nature03086',
        },
      ],
    },
    {
      id: 'stranger-close',
      label: 'A stranger stands nose-to-nose',
      description:
        'In conversation, a person you have just met steps in until your faces are a hand\'s ' +
        'width apart.',
      choices: [
        { id: 'step-back', label: 'Steps back to a comfortable distance', correct: false },
        { id: 'fine', label: 'Feels completely comfortable at any distance', correct: true },
        { id: 'freeze', label: 'Freezes and stops talking', correct: false },
        { id: 'annoyed', label: 'Feels irritated and says so', correct: false },
      ],
      intact: {
        heartRateBpm: 92,
        sweat: 'mild',
        behavior: 'Leans back, then steps away to roughly arm\'s length',
        report: '"Way too close."',
      },
      damaged: {
        heartRateBpm: 70,
        sweat: 'none',
        behavior: 'Holds position; would be comfortable even touching noses',
        report: '"This is fine. Is it not fine?"',
      },
      explanation:
        'The amygdala sets how close is too close. Asked to stop an approaching experimenter ' +
        'at the point of discomfort, S.M. let them come to about half the distance other ' +
        'people chose, and reported no discomfort even nose-to-nose, while understanding ' +
        'perfectly well what personal space is.',
      dayToDay:
        'Personal space is a fear response we never experience as fear. Lose it, and other ' +
        'people\'s boundaries have to be learned as rules rather than felt as a nudge.',
      sources: [
        {
          claim: 'Bilateral amygdala damage abolishes the sense of personal space.',
          citation: 'Kennedy, Gläscher, Tyszka & Adolphs (2009), Nature Neuroscience',
          url: 'https://doi.org/10.1038/nn.2381',
        },
      ],
    },
  ],
  plasticity: {
    mechanism:
      'Compensation, not repair. The amygdala does not grow back, and fear does not return. ' +
      'What changes is that cortical routes — memory, reasoning, other people\'s warnings — ' +
      'build an explicit rulebook: keep your distance from strangers, do not touch the ' +
      'snake, read the room by what people say rather than what their faces do.',
    timeline: [
      { week: 0, recoveryFraction: 0 },
      { week: 4, recoveryFraction: 0.15 },
      { week: 12, recoveryFraction: 0.35 },
      { week: 26, recoveryFraction: 0.55 },
      { week: 52, recoveryFraction: 0.7 },
      { week: 104, recoveryFraction: 0.8 },
    ],
    caveat:
      'This slider tracks learned safety behaviours adopted — rules the person follows — ' +
      'not fear regained. Even years on, these rules run on knowledge alone. The alarm that ' +
      'would fire them automatically stays silent.',
  },
  sources: [
    {
      claim:
        'The amygdala mediates fear induction, fear recognition and personal space; ' +
        'bilateral damage produces a stable, lifelong loss.',
      citation: 'Feinstein et al. (2011); Adolphs et al. (1994); Kennedy et al. (2009)',
    },
  ],
};

export default amygdala;
