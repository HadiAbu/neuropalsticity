import type { SomatotopicContent } from '@content/schema';

const somatosensoryCortex: SomatotopicContent = {
  kind: 'somatotopic',
  id: 'somatosensory-cortex',
  name: 'Primary somatosensory cortex (postcentral gyrus)',
  plainName: 'the touch map',
  overview:
    'A strip of cortex running right behind the motor strip, on the other side of the same ' +
    'deep groove. Every touch, pressure, temperature and position signal from your skin and ' +
    'joints arrives here first.',
  insight:
    'Like its neighbour the motor strip, this map is not drawn to the scale of your body — ' +
    'it is drawn to the scale of how finely you can feel. Your lips and fingertips can tell ' +
    'two points apart a couple of millimetres apart; your back can barely tell two points ' +
    'apart at four centimetres. The cortex hands out space to match, so lips and hands ' +
    'dominate the map while the torso is a sliver.',
  territories: [
    { id: 'toes',     label: 'Toes',     corticalShare: 0.02, order: 0 },
    { id: 'leg',      label: 'Leg',      corticalShare: 0.04, order: 1 },
    { id: 'hip',      label: 'Hip',      corticalShare: 0.02, order: 2 },
    { id: 'trunk',    label: 'Trunk',    corticalShare: 0.03, order: 3 },
    { id: 'shoulder', label: 'Shoulder', corticalShare: 0.03, order: 4 },
    { id: 'arm',      label: 'Arm',      corticalShare: 0.04, order: 5 },
    { id: 'hand',     label: 'Hand',     corticalShare: 0.11, order: 6 },
    { id: 'fingers',  label: 'Fingers',  corticalShare: 0.15, order: 7 },
    { id: 'thumb',    label: 'Thumb',    corticalShare: 0.09, order: 8 },
    { id: 'neck',     label: 'Neck',     corticalShare: 0.02, order: 9 },
    { id: 'face',     label: 'Face',     corticalShare: 0.1,  order: 10 },
    { id: 'lips',     label: 'Lips',     corticalShare: 0.15, order: 11 },
    { id: 'jaw',      label: 'Jaw',      corticalShare: 0.05, order: 12 },
    { id: 'tongue',   label: 'Tongue',   corticalShare: 0.15, order: 13 },
  ],
  scenarios: [
    {
      id: 'hand-astereognosis',
      label: 'A small stroke over the hand area',
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
        'The hand still moves normally — motor control is untouched — but reaching into a ' +
        'pocket and finding keys by feel becomes impossible. Everything has to be checked by ' +
        'sight instead.',
      surprise:
        'The hand is not numb in the ordinary sense. Light touch can even be detected. What is ' +
        'lost is the ability to build a shape from that touch — a coin and a button feel like ' +
        'the same meaningless pressure. This is astereognosis: touch without recognition.',
      sources: [
        {
          claim:
            'Damage to somatosensory cortex and adjacent parietal association areas produces ' +
            'astereognosis: an inability to identify objects by touch despite preserved basic ' +
            'sensation.',
          citation: 'Caselli (1993), Neurology',
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
        'One side of the face and the arm go numb together — food falls from the mouth ' +
        'unnoticed on that side, and a hot cup is not felt as hot until it is nearly dropped.',
      surprise:
        'Just as with the neighbouring motor strip, the leg is spared for a reason that has ' +
        'nothing to do with the map: its territory sits over the midline and is fed by a ' +
        'different artery entirely.',
      sources: [
        {
          claim:
            'Middle cerebral artery strokes affecting the lateral postcentral gyrus cause ' +
            'contralateral face and arm sensory loss with relative sparing of the leg, ' +
            'mirroring the motor strip\'s territory.',
          citation: 'Bogousslavsky & Caplan, eds. (2001), Stroke Syndromes',
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
        'Walking becomes unsteady because the foot cannot report where it has landed, while ' +
        'the hand on the same side still reads texture and temperature normally.',
      sources: [
        {
          claim:
            'Lesions of the medial postcentral gyrus, in anterior cerebral artery territory, ' +
            'produce contralateral leg-dominant sensory loss.',
          citation: 'Bogousslavsky & Regli (1990), Archives of Neurology',
        },
      ],
    },
  ],
  plasticity: {
    mechanism:
      'The same use-dependent remapping that helps the motor strip recover applies here: ' +
      'neighbouring cortex takes over lost territory, but only for input that is actually ' +
      'practised. Touch-discrimination training — tracing shapes, sorting objects by feel — ' +
      'drives measurably more recovery than passive stimulation.',
    timeline: [
      { week: 0, recoveryFraction: 0 },
      { week: 1, recoveryFraction: 0.07 },
      { week: 2, recoveryFraction: 0.16 },
      { week: 4, recoveryFraction: 0.32 },
      { week: 8, recoveryFraction: 0.5 },
      { week: 12, recoveryFraction: 0.62 },
      { week: 24, recoveryFraction: 0.68 },
    ],
    caveat:
      'Fine discrimination — telling a coin from a button by feel — is the last thing to ' +
      'return and often stays permanently coarser, even when simple touch and temperature ' +
      'recover well.',
  },
  sources: [
    {
      claim:
        'The somatosensory homunculus allocates cortical area by tactile discrimination acuity ' +
        'rather than body size — hands, lips and tongue are hugely overrepresented.',
      citation: 'Penfield & Rasmussen (1950), The Cerebral Cortex of Man',
    },
  ],
};

export default somatosensoryCortex;
