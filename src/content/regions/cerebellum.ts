import type { CoordinationContent } from '@content/schema';

const cerebellum: CoordinationContent = {
  kind: 'coordination',
  id: 'cerebellum',
  name: 'Cerebellum',
  plainName: 'the balance and coordination centre',
  overview:
    'A dense, tightly folded structure tucked under the back of the brain, holding more ' +
    'neurons than everywhere else in the brain combined. It does not decide what to do — it ' +
    'fine-tunes how a movement actually unfolds, correcting it in real time as it happens.',
  insight:
    'The cerebellum is a comparator. It constantly checks the movement your brain intended ' +
    'against the movement your body is actually making, and corrects the difference before ' +
    'you ever notice a mismatch. Damage it, and the intention stays perfectly clear — you ' +
    'know exactly where you want your hand to go — but the fine, split-second correction that ' +
    'gets it there smoothly is gone.',
  premise:
    'In this level the cerebellum is damaged on both sides, as it classically is after ' +
    'diseases like cerebellar stroke, alcohol-related cerebellar degeneration, or certain ' +
    'tumours. The three tests below are the same bedside exam a neurologist still performs today.',
  trials: [
    {
      id: 'finger-to-nose',
      label: 'Finger-to-nose test',
      description:
        'Touch the examiner\'s finger, then your own nose, back and forth, as accurately as ' +
        'you can.',
      choices: [
        { id: 'smooth', label: 'Touches both targets smoothly and precisely', correct: false },
        { id: 'overshoots', label: 'Overshoots the target, developing a tremor that grows worse the closer the finger gets', correct: true },
        { id: 'weak', label: 'Moves slowly and weakly, but lands on target', correct: false },
        { id: 'refuses', label: 'Cannot locate the finger at all, groping in the wrong direction', correct: false },
      ],
      intact: {
        gait: 'steady',
        intentionTremor: false,
        rapidAlternatingMovements: 'normal',
        speechQuality: 'normal',
        behavior: 'Touches the finger and nose smoothly and precisely, again and again',
        report: '"Easy enough."',
      },
      damaged: {
        gait: 'wide-based and unsteady',
        intentionTremor: true,
        rapidAlternatingMovements: 'irregular',
        speechQuality: 'scanning',
        behavior: 'Overshoots the target and develops a coarse tremor that gets worse as the finger nears its goal',
        report: '"I know exactly where it is — my hand just won\'t stop where I want it to."',
      },
      explanation:
        'This is intention tremor and dysmetria — the cerebellum\'s real-time steering is ' +
        'gone, so the hand overcorrects again and again as it closes in, rather than gliding ' +
        'to a stop. The tremor appears only during the movement, near the target — unlike a ' +
        'resting tremor, which shows up when the limb is still.',
      dayToDay:
        'Threading a needle, buttoning a shirt, or bringing a spoon to the mouth without ' +
        'spilling becomes a real, constant effort — not from weakness, but from a hand that ' +
        'cannot stop fine-tuning itself.',
      sources: [
        {
          claim:
            'Cerebellar lesions classically produce intention tremor and dysmetria on reaching ' +
            'tasks such as finger-to-nose testing, distinct from resting tremor.',
          citation: 'Holmes (1917), Brain',
        },
      ],
    },
    {
      id: 'tandem-gait',
      label: 'Walking heel-to-toe',
      description: 'Walk a straight line, placing the heel of each foot directly against the toes of the other.',
      choices: [
        { id: 'perfect', label: 'Walks the line perfectly, arms relaxed', correct: false },
        { id: 'staggers', label: 'Staggers with feet spread wide, arms out for balance, veering off the line', correct: true },
        { id: 'afraid', label: 'Refuses, purely out of fear of falling', correct: false },
        { id: 'slow-steady', label: 'Walks unusually slowly but stays perfectly balanced', correct: false },
      ],
      intact: {
        gait: 'steady',
        intentionTremor: false,
        rapidAlternatingMovements: 'normal',
        speechQuality: 'normal',
        behavior: 'Walks the line smoothly, arms relaxed at the sides',
        report: '"No problem."',
      },
      damaged: {
        gait: 'wide-based and unsteady',
        intentionTremor: true,
        rapidAlternatingMovements: 'irregular',
        speechQuality: 'scanning',
        behavior: 'Widens the stance, arms flung out for balance, and veers off the line within a few steps',
        report: '"I feel like the floor is tilting under me."',
      },
      explanation:
        'This is truncal and gait ataxia. Ordinary walking is a constantly self-correcting ' +
        'balancing act, and the cerebellum is what runs the correction. Without it, the body ' +
        'widens its base of support the way anyone would on a rocking boat — a real, ' +
        'physical compensation for a steering system that no longer works.',
      dayToDay:
        'Walking on uneven ground, in the dark, or after a single drink becomes genuinely ' +
        'dangerous — the safety margin that healthy balance quietly provides is gone.',
      sources: [
        {
          claim:
            'Cerebellar damage produces a characteristic wide-based, staggering gait with ' +
            'truncal instability, a core finding in cerebellar ataxia.',
          citation: 'Diener & Dichgans (1992), Movement Disorders',
        },
      ],
    },
    {
      id: 'rapid-alternating-and-speech',
      label: 'Rapid hand movements and a spoken sentence',
      description:
        'Pat one hand rapidly on the other, alternating palm and back of the hand, as fast as ' +
        'possible — then recite a short, familiar sentence.',
      choices: [
        { id: 'normal-both', label: 'Movements stay crisp and even; speech is clear and normal', correct: false },
        { id: 'slurred-only', label: 'Speech slurs badly, but the hand movements stay crisp', correct: false },
        { id: 'clumsy-choppy', label: 'Movements turn irregular and clumsy; speech comes out slow, jerky, and broken into separate syllables', correct: true },
        { id: 'forgets', label: 'Cannot recall the sentence at all', correct: false },
      ],
      intact: {
        gait: 'steady',
        intentionTremor: false,
        rapidAlternatingMovements: 'normal',
        speechQuality: 'normal',
        behavior: 'Alternates the hand crisply and evenly, then recites the sentence smoothly',
        report: '"The quick brown fox jumps over the lazy dog."',
      },
      damaged: {
        gait: 'wide-based and unsteady',
        intentionTremor: true,
        rapidAlternatingMovements: 'irregular',
        speechQuality: 'scanning',
        behavior: 'The hand alternation turns irregular and clumsy; speech breaks into slow, evenly stressed syllables',
        report: '"The... quick... brown... fox... jumps..."',
      },
      explanation:
        'The clumsy hand movements are dysdiadochokinesia — an inability to smoothly alternate ' +
        'opposite motions. The speech pattern is scanning dysarthria: without fine timing ' +
        'control over the muscles of speech, words come out evenly spaced and mechanical, as ' +
        'if each syllable were being placed by hand rather than flowing naturally. The ' +
        'cerebellum coordinates the muscles of speech exactly the way it coordinates a reaching hand.',
      dayToDay:
        'Speech remains fully understood — the words and grammar are untouched — but it can ' +
        'sound halting or even mistaken for slurred, drunken speech to a stranger.',
      sources: [
        {
          claim:
            'The cerebellum contributes to the fine temporal coordination of speech, and its ' +
            'damage produces scanning dysarthria characterized by irregular timing and stress.',
          citation: 'Ackermann (2008), Trends in Neurosciences',
        },
      ],
    },
  ],
  plasticity: {
    mechanism:
      'Balance and coordination run on fast feedback loops between the cerebellum, the inner ' +
      'ear, and the rest of the brain. After damage, the cerebellar tissue that survives, ' +
      'along with neighbouring circuits, gradually retunes those loops through repeated, ' +
      'deliberate practice — a slow, physical kind of relearning, not unlike learning to ' +
      'stand steady on a boat that never stops rocking.',
    timeline: [
      { week: 0, recoveryFraction: 0 },
      { week: 4, recoveryFraction: 0.2 },
      { week: 12, recoveryFraction: 0.42 },
      { week: 26, recoveryFraction: 0.6 },
      { week: 52, recoveryFraction: 0.72 },
      { week: 104, recoveryFraction: 0.78 },
    ],
    caveat:
      'This tracks gross balance and gait, which recover the most and the fastest with ' +
      'practice. The fine tremor on precise reaching, and the clipped rhythm of scanning ' +
      'speech, often remain — partial and imperfect, even years on.',
  },
  sources: [
    {
      claim:
        'The cerebellum acts as a real-time comparator refining ongoing movement, and its ' +
        'damage produces a characteristic triad of gait ataxia, intention tremor, and ' +
        'dysdiadochokinesia.',
      citation: 'Holmes (1917), Brain',
    },
  ],
};

export default cerebellum;
