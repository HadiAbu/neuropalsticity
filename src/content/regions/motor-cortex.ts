import type { SomatotopicContent } from '@content/schema';

const motorCortex: SomatotopicContent = {
  kind: 'somatotopic',
  id: 'motor-cortex',
  name: 'Primary motor cortex (precentral gyrus)',
  plainName: 'the motor cortex',
  overview:
    'A strip of cortex running over the top of your brain, just in front of the deep ' +
    'groove that separates the front half from the back. It sends the commands that ' +
    'move your body.',
  insight:
    'The strip is a map of your body — but a wildly distorted one. Cortical space is ' +
    'handed out by precision of control, not by body size. Your hand and lips need ' +
    'exquisitely fine control, so they command huge stretches of cortex. Your torso, ' +
    'which mostly moves in bulk, barely gets a sliver.',
  territories: [
    { id: 'toes',     label: 'Toes',     corticalShare: 0.03, order: 0 },
    { id: 'leg',      label: 'Leg',      corticalShare: 0.05, order: 1 },
    { id: 'hip',      label: 'Hip',      corticalShare: 0.03, order: 2 },
    { id: 'trunk',    label: 'Trunk',    corticalShare: 0.04, order: 3 },
    { id: 'shoulder', label: 'Shoulder', corticalShare: 0.04, order: 4 },
    { id: 'arm',      label: 'Arm',      corticalShare: 0.05, order: 5 },
    { id: 'hand',     label: 'Hand',     corticalShare: 0.13, order: 6 },
    { id: 'fingers',  label: 'Fingers',  corticalShare: 0.12, order: 7 },
    { id: 'thumb',    label: 'Thumb',    corticalShare: 0.08, order: 8 },
    { id: 'neck',     label: 'Neck',     corticalShare: 0.03, order: 9 },
    { id: 'face',     label: 'Face',     corticalShare: 0.11, order: 10 },
    { id: 'lips',     label: 'Lips',     corticalShare: 0.13, order: 11 },
    { id: 'jaw',      label: 'Jaw',      corticalShare: 0.07, order: 12 },
    { id: 'tongue',   label: 'Tongue',   corticalShare: 0.09, order: 13 },
  ],
  scenarios: [
    {
      id: 'hand-knob',
      label: 'A small stroke in the hand-knob',
      siteTerritory: 'hand',
      deficits: [
        { part: 'hand', severity: 'complete' },
        { part: 'fingers', severity: 'complete' },
        { part: 'thumb', severity: 'partial' },
        { part: 'arm', severity: 'spared' },
        { part: 'shoulder', severity: 'spared' },
        { part: 'face', severity: 'spared' },
        { part: 'leg', severity: 'spared' },
        { part: 'toes', severity: 'spared' },
      ],
      dayToDay:
        'Buttons, keys and cutlery become impossible on that side, while the arm itself ' +
        'lifts and reaches normally. People often assume they have trapped a nerve in ' +
        'their wrist.',
      surprise:
        'A lesion the size of a pea, in the right spot, can paralyse just the fingers — ' +
        'so convincingly that it mimics a pinched nerve in the arm rather than a stroke ' +
        'in the brain.',
      sources: [
        {
          claim:
            'Small lesions of the hand-knob area of motor cortex can produce isolated hand ' +
            'weakness resembling a peripheral nerve palsy.',
          citation: 'Selective hand motor cortex lesions masquerading as peripheral palsy',
          url: 'https://journals.lww.com/annalsofian/fulltext/2020/23050/selective_hand_motor_cortex_lesions_masquerading.25.aspx',
        },
      ],
    },
    {
      id: 'lateral-mca',
      label: 'A middle cerebral artery stroke',
      siteTerritory: 'face',
      deficits: [
        { part: 'face', severity: 'complete' },
        { part: 'lips', severity: 'complete' },
        { part: 'jaw', severity: 'partial' },
        { part: 'tongue', severity: 'partial' },
        { part: 'neck', severity: 'partial' },
        { part: 'arm', severity: 'complete' },
        { part: 'hand', severity: 'partial' },
        { part: 'fingers', severity: 'partial' },
        { part: 'thumb', severity: 'partial' },
        { part: 'shoulder', severity: 'partial' },
        { part: 'trunk', severity: 'spared' },
        { part: 'hip', severity: 'spared' },
        { part: 'leg', severity: 'spared' },
        { part: 'toes', severity: 'spared' },
      ],
      dayToDay:
        'One side of the face droops and the arm hangs heavy, but the person can often ' +
        'still walk — which is exactly why this pattern is so frequently missed at first.',
      surprise:
        'The leg is spared for a reason that has nothing to do with the map: the leg ' +
        'territory sits over the midline and is fed by a different artery entirely.',
      sources: [
        {
          claim:
            'Middle cerebral artery strokes affecting the lateral motor strip cause ' +
            'contralateral face and arm weakness with relative sparing of the leg.',
          citation: 'Stroke in the motor cortex — patterns of deficit',
          url: 'https://www.flintrehab.com/stroke-in-the-motor-cortex/',
        },
      ],
    },
    {
      id: 'medial-aca',
      label: 'An anterior cerebral artery stroke',
      siteTerritory: 'leg',
      deficits: [
        { part: 'toes', severity: 'complete' },
        { part: 'leg', severity: 'complete' },
        { part: 'hip', severity: 'partial' },
        { part: 'trunk', severity: 'partial' },
        { part: 'shoulder', severity: 'spared' },
        { part: 'arm', severity: 'spared' },
        { part: 'hand', severity: 'spared' },
        { part: 'fingers', severity: 'spared' },
        { part: 'face', severity: 'spared' },
        { part: 'lips', severity: 'spared' },
      ],
      dayToDay:
        'The leg gives way and walking becomes unsafe, while the hand on that same side ' +
        'still writes and grips normally — the mirror image of the more familiar stroke.',
      sources: [
        {
          claim:
            'Lesions of the medial motor strip, in anterior cerebral artery territory, ' +
            'produce contralateral leg-dominant weakness.',
          citation: 'Primary motor cortex — somatotopic organisation and lesion effects',
          url: 'https://www.sciencedirect.com/topics/medicine-and-dentistry/primary-motor-cortex',
        },
      ],
    },
  ],
  plasticity: {
    mechanism:
      'Use-dependent plasticity. Cortex next door to the damage gradually takes over ' +
      'some of the lost territory — but only for movements that are actually practised, ' +
      'over and over. This is why rehab is repetitive to the point of tedium.',
    timeline: [
      { week: 0, recoveryFraction: 0 },
      { week: 1, recoveryFraction: 0.08 },
      { week: 2, recoveryFraction: 0.18 },
      { week: 4, recoveryFraction: 0.35 },
      { week: 8, recoveryFraction: 0.52 },
      { week: 12, recoveryFraction: 0.63 },
      { week: 24, recoveryFraction: 0.7 },
    ],
    caveat:
      'Recovery is partial and varies enormously between people. The steepest gains come ' +
      'early, and progress slows rather than stopping. This is a hopeful picture, not a ' +
      'promised one.',
  },
  sources: [
    {
      claim:
        'The motor homunculus allocates cortical area by precision of control rather than ' +
        'body size.',
      citation: 'Primary motor cortex — somatotopic organisation',
      url: 'https://www.sciencedirect.com/topics/medicine-and-dentistry/primary-motor-cortex',
    },
  ],
};

export default motorCortex;
