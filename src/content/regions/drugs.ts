import type { PharmacologicContent } from '@content/schema';

const drugs: PharmacologicContent = {
  kind: 'pharmacologic',
  id: 'drugs-classes',
  name: 'Drugs & the brain',
  plainName: 'chemistry',
  overview:
    'Every drug that changes how you feel does it at the synapse — the gap where one neuron ' +
    'talks to the next. There are only a few ways in: turn up the brakes, jam the recycling ' +
    'pump, or impersonate the messenger.',
  insight:
    'A drug never adds a feeling the brain cannot already make. It hijacks a signal that is ' +
    'already there. And because the brain is adaptable, it adjusts to the hijack — which is ' +
    'where tolerance, dependence and withdrawal come from.',
  pathway:
    'The reward pathway: dopamine neurons in the midbrain (the VTA, marked approximately) ' +
    'project to the striatum. Cocaine acts here directly; alcohol and opioids reach it ' +
    'indirectly.',
  substances: [
    {
      id: 'alcohol',
      label: 'Alcohol',
      drugClass: 'depressant',
      scenario: 'Three drinks in an hour at a party.',
      transmitter: 'GABA',
      action: 'enhances-receptor',
      synapse: {
        baseline: { transmitterInCleft: 0.3, receptorActivation: 0.3, receptorDensity: 1 },
        acute: { transmitterInCleft: 0.3, receptorActivation: 0.8, receptorDensity: 1 },
        tolerant: { transmitterInCleft: 0.3, receptorActivation: 0.2, receptorDensity: 0.65 },
      },
      choices: [
        { id: 'sharper', label: 'Sharper, faster, more alert', correct: false },
        { id: 'loose', label: 'Slower reactions, louder, less careful', correct: true },
        { id: 'asleep', label: 'Falls asleep almost at once', correct: false },
        { id: 'none', label: 'No noticeable change', correct: false },
      ],
      sober: {
        heartRateBpm: 70,
        reactionTimeMs: 250,
        mood: 'steady',
        behavior: 'Weighs what to say before saying it',
        report: '"Fine, thanks."',
      },
      acute: {
        heartRateBpm: 84,
        reactionTimeMs: 330,
        mood: 'warm, loose, overconfident',
        behavior: 'Talks over people, misjudges a step on the stairs',
        report: '"I\'m completely fine to drive."',
      },
      explanation:
        'Alcohol makes GABA receptors — the brain\'s main brake — respond more strongly, and ' +
        'at the same time muffles glutamate, the main accelerator. The result is a brain ' +
        'running with the brakes half on: reactions slow, judgement loosens, and the part ' +
        'that would notice all this is dampened too.',
      adaptation:
        'With nightly drinking the brain thins out its GABA receptors and adds glutamate ' +
        'ones, so the same drinks do less. Take the alcohol away and the brakes are weak while ' +
        'the accelerator is stuck: shaking, anxiety, and in severe cases seizures.',
      dayToDay:
        'The most dangerous effect is the one you cannot feel: impaired judgement about how ' +
        'impaired you are.',
      sources: [
        {
          claim: 'Alcohol potentiates GABA-A receptor function and inhibits NMDA glutamate receptors.',
          citation: 'Valenzuela (1997), Alcohol Health & Research World 21(2)',
          url: 'https://pubs.niaaa.nih.gov/publications/arh21-2/144.pdf',
        },
        {
          claim: 'Chronic alcohol exposure produces compensatory changes in GABA and glutamate systems that underlie tolerance and withdrawal.',
          citation: 'Koob & Volkow (2016), The Lancet Psychiatry',
          url: 'https://doi.org/10.1016/S2215-0366(16)00104-8',
        },
      ],
    },
    {
      id: 'cocaine',
      label: 'Cocaine',
      drugClass: 'stimulant',
      scenario: 'A line of cocaine at the same party.',
      transmitter: 'dopamine',
      action: 'blocks-reuptake',
      synapse: {
        baseline: { transmitterInCleft: 0.3, receptorActivation: 0.3, receptorDensity: 1 },
        acute: { transmitterInCleft: 0.95, receptorActivation: 0.9, receptorDensity: 1 },
        tolerant: { transmitterInCleft: 0.95, receptorActivation: 0.5, receptorDensity: 0.55 },
      },
      choices: [
        { id: 'calm', label: 'Calm and drowsy', correct: false },
        { id: 'euphoric', label: 'Euphoric, talkative, heart racing, feels invincible', correct: true },
        { id: 'painfree', label: 'Pain-free and warm', correct: false },
        { id: 'anxious', label: 'Anxious and slowed down', correct: false },
      ],
      sober: {
        heartRateBpm: 70,
        reactionTimeMs: 250,
        mood: 'steady',
        behavior: 'Chats, checks the time',
        report: '"Good night so far."',
      },
      acute: {
        heartRateBpm: 122,
        reactionTimeMs: 215,
        mood: 'euphoric, grandiose',
        behavior: 'Talks fast, cannot sit still, takes a bet they would never take sober',
        report: '"I have never felt this good in my life."',
      },
      explanation:
        'Dopamine is normally released, does its job, and is pumped straight back into the ' +
        'neuron by a transporter. Cocaine jams that pump. Dopamine piles up in the cleft of ' +
        'the reward pathway and keeps firing the receptors — the same signal that says ' +
        '"this mattered, do it again", turned up far past anything ordinary life produces.',
      adaptation:
        'Flooded again and again, the receiving neurons pull dopamine D2 receptors back. ' +
        'Ordinary pleasures go flat, the drug does less, and the drive to use grows. The ' +
        'adaptation that protects the cell hollows out everyday reward.',
      dayToDay:
        'The high is the reward signal itself, borrowed. Everything that used to earn a small ' +
        'version of it now has to compete with the counterfeit.',
      sources: [
        {
          claim: 'Cocaine\'s reinforcing effects track its blockade of the dopamine transporter.',
          citation: 'Ritz, Lamb, Goldberg & Kuhar (1987), Science',
          url: 'https://doi.org/10.1126/science.2820058',
        },
        {
          claim: 'Cocaine users show reduced striatal dopamine D2 receptor availability.',
          citation: 'Volkow et al. (1993), Synapse',
          url: 'https://doi.org/10.1002/syn.890140210',
        },
      ],
    },
    {
      id: 'morphine',
      label: 'Morphine',
      drugClass: 'opioid',
      scenario: 'A morphine injection on the ward the day after surgery.',
      transmitter: 'endorphin',
      action: 'mimics-transmitter',
      synapse: {
        baseline: { transmitterInCleft: 0.2, receptorActivation: 0.2, receptorDensity: 1 },
        acute: { transmitterInCleft: 0.2, receptorActivation: 0.9, receptorDensity: 1 },
        tolerant: { transmitterInCleft: 0.2, receptorActivation: 0.15, receptorDensity: 0.5 },
      },
      choices: [
        { id: 'alert', label: 'Alert and energetic', correct: false },
        { id: 'relief', label: 'Pain fades, warm and drowsy, breathing slows', correct: true },
        { id: 'painonly', label: 'Pain gone, otherwise unchanged', correct: false },
        { id: 'nausea', label: 'Nauseous, no pain relief', correct: false },
      ],
      sober: {
        heartRateBpm: 82,
        reactionTimeMs: 260,
        mood: 'tense, in pain',
        behavior: 'Braces before every movement',
        report: '"It hurts to breathe in."',
      },
      acute: {
        heartRateBpm: 62,
        reactionTimeMs: 320,
        mood: 'calm, warm, detached',
        behavior: 'Eyes half-closed, breathing slow and shallow',
        report: '"The pain is somewhere far away."',
      },
      explanation:
        'Your own endorphins fit opioid receptors like a key. Morphine is a copy of the key. ' +
        'It quiets pain signalling in the spinal cord and brainstem, and lights the reward ' +
        'pathway on the way through. It also sits on receptors in the brainstem centres that ' +
        'drive breathing — which is why the same molecule that ends pain can end breathing.',
      adaptation:
        'Cells compensate for constant opioid signalling by muting the receptors and turning ' +
        'up their own alarm chemistry. Higher doses are needed for the same relief; stopping ' +
        'hurts. Tolerance to the high builds faster than tolerance to slowed breathing, which ' +
        'is why a return to an old dose after a break is so often fatal.',
      dayToDay:
        'Used briefly, under supervision, this is one of medicine\'s great mercies. The ' +
        'danger is in how well it works, and how quickly the brain rearranges itself around it.',
      sources: [
        {
          claim: 'µ-opioid receptor desensitization and internalization underlie opioid tolerance.',
          citation: 'Williams et al. (2013), Pharmacological Reviews',
          url: 'https://doi.org/10.1124/pr.112.005942',
        },
        {
          claim: 'Opioids depress respiration through receptors in brainstem respiratory centres.',
          citation: 'Pattinson (2008), British Journal of Anaesthesia',
          url: 'https://doi.org/10.1093/bja/aen094',
        },
      ],
    },
  ],
  plasticity: {
    mechanism:
      'The brain treats a drug as the new normal and adapts: receptors are pulled back or ' +
      'muted, brakes and accelerators rebalanced. That adaptation is tolerance, and its ' +
      'shadow is dependence — the drug now needed just to feel ordinary. This is ' +
      'neuroplasticity doing exactly what it is for, pointed the wrong way.',
    timeline: [
      { week: 0, recoveryFraction: 0 },
      { week: 2, recoveryFraction: 0.15 },
      { week: 4, recoveryFraction: 0.3 },
      { week: 12, recoveryFraction: 0.55 },
      { week: 26, recoveryFraction: 0.75 },
      { week: 52, recoveryFraction: 0.85 },
    ],
    caveat:
      'This tracks receptor availability recovering after use stops, on the months-long ' +
      'timescale imaging studies show. It is partial at a year, slower for some substances, ' +
      'and craving can outlast it by years. Recovery is real. It is not quick.',
  },
  sources: [
    {
      claim: 'Dopamine transporter losses in stimulant users recover substantially with protracted abstinence.',
      citation: 'Volkow et al. (2001), Journal of Neuroscience',
      url: 'https://doi.org/10.1523/JNEUROSCI.21-23-09414.2001',
    },
  ],
};

export default drugs;
