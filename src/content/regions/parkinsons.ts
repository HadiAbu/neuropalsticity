import type { MotorExamContent } from '@content/schema';

const parkinsons: MotorExamContent = {
  kind: 'motorExam',
  id: 'parkinsons',
  name: "Parkinson's disease",
  plainName: 'a movement disorder',
  overview:
    'Deep beneath the cortex, the basal ganglia — the caudate and putamen shown glowing here, ' +
    'working with a dopamine-producing nucleus in the midbrain — help start movements and ' +
    'suppress the ones you did not intend to make. Parkinson\'s disease is what happens when ' +
    'the dopamine supply to this circuit slowly fails.',
  insight:
    'By the time the first tremor appears, roughly two-thirds to four-fifths of the dopamine ' +
    'neurons that feed this circuit are already gone. The brain compensates for the loss, ' +
    'silently, for years — the disease has been present a long time before it becomes visible.',
  premise:
    'Here the substance is a person examined years after diagnosis, dopamine levels in the ' +
    'basal ganglia well below normal. The three tests below are the same bedside exam a ' +
    'neurologist performs today to recognize it.',
  trials: [
    {
      id: 'resting-tremor',
      label: 'Hands resting quietly in the lap',
      description: 'Seated, hands resting on the thighs, not being asked to do anything at all.',
      choices: [
        { id: 'none', label: 'Hands stay completely still', correct: false },
        { id: 'worsens-with-movement', label: 'A tremor appears only once they reach for something, and gets worse the closer they get', correct: false },
        { id: 'pill-rolling', label: 'A rhythmic tremor appears at rest, and vanishes the instant they reach for a cup', correct: true },
        { id: 'legs-only', label: 'A tremor appears in the legs but never the hands', correct: false },
      ],
      intact: {
        restingTremor: false,
        rigidity: 'normal',
        movementSpeed: 'normal',
        posturalStability: 'stable',
        behavior: 'Hands rest still and quiet',
        report: '"Nothing unusual."',
      },
      damaged: {
        restingTremor: true,
        rigidity: 'cogwheel',
        movementSpeed: 'bradykinetic',
        posturalStability: 'unstable',
        behavior: 'A rhythmic, rolling tremor appears in the hand at rest and disappears the instant it reaches for a cup',
        report: '"It shakes until I actually use it. Then it just stops."',
      },
      explanation:
        'This is the classic resting tremor — present when a limb is idle, suppressed the ' +
        'moment it engages in a voluntary movement. The same basal ganglia circuit that ' +
        'initiates a deliberate movement also damps down the resting oscillation once it takes ' +
        'over, which is why the tremor and the movement are never present at the same time.',
      dayToDay:
        'The tremor is often more visible to other people than disruptive to the person having ' +
        'it — many daily tasks are unaffected, since the hand steadies the instant it is actually used.',
      sources: [
        {
          claim:
            'Resting tremor in Parkinson\'s disease is present at rest and characteristically ' +
            'attenuates with voluntary movement, distinguishing it from cerebellar intention tremor.',
          citation: 'Jankovic (2008), Journal of Neurology, Neurosurgery & Psychiatry',
          url: 'https://doi.org/10.1136/jnnp.2007.131045',
        },
      ],
    },
    {
      id: 'rigidity',
      label: "Examiner bends the patient's wrist back and forth",
      description: 'The wrist is passively flexed and extended by the examiner, the patient trying to relax it completely.',
      choices: [
        { id: 'floppy', label: 'No resistance at all — the wrist swings loosely', correct: false },
        { id: 'smooth-resistance', label: 'Constant, smooth resistance throughout, with no catching', correct: false },
        { id: 'cogwheel', label: 'Resistance throughout, catching in small rhythmic jerks', correct: true },
        { id: 'end-range-only', label: 'No resistance until the very end of the movement', correct: false },
      ],
      intact: {
        restingTremor: false,
        rigidity: 'normal',
        movementSpeed: 'normal',
        posturalStability: 'stable',
        behavior: 'The wrist moves loosely with no resistance',
        report: '"That feels normal."',
      },
      damaged: {
        restingTremor: true,
        rigidity: 'cogwheel',
        movementSpeed: 'bradykinetic',
        posturalStability: 'unstable',
        behavior: 'The wrist resists throughout the movement, catching in small rhythmic jerks as it goes',
        report: '"I can feel it catching, like a ratchet — I\'m not doing that on purpose."',
      },
      explanation:
        'Without enough dopamine, the basal ganglia\'s output no longer balances muscle tone ' +
        'properly, leaving muscles constantly, involuntarily tensed — rigidity. When the ' +
        'resting tremor rides on top of that constant tension, the two combine into the ' +
        'ratchet-like catching known as cogwheel rigidity.',
      dayToDay:
        'Ordinary movements — turning in bed, buttoning a shirt — take real, constant muscular ' +
        'effort even though nothing is weak.',
      sources: [
        {
          claim:
            'Parkinsonian rigidity reflects increased resting muscle tone from disrupted basal ' +
            'ganglia output, and combines with tremor to produce the characteristic cogwheel sign.',
          citation: 'Jankovic (2008), Journal of Neurology, Neurosurgery & Psychiatry',
          url: 'https://doi.org/10.1136/jnnp.2007.131045',
        },
      ],
    },
    {
      id: 'finger-tapping',
      label: 'Tapping thumb and index finger together, as fast and as big as possible',
      description: 'Repeated finger tapping, as quickly and with as wide a motion as they can manage, for ten seconds.',
      choices: [
        { id: 'consistent-slow', label: 'Slow and small from the very first tap, staying constant', correct: false },
        { id: 'decrementing', label: 'Starts fast and full, then rapidly slows and shrinks with each repetition', correct: true },
        { id: 'full-speed', label: 'Stays fast and full for the entire ten seconds', correct: false },
        { id: 'stops', label: 'Stops moving entirely after the first few taps', correct: false },
      ],
      intact: {
        restingTremor: false,
        rigidity: 'normal',
        movementSpeed: 'normal',
        posturalStability: 'stable',
        behavior: 'Taps quickly and fully for the entire ten seconds',
        report: '"Easy."',
      },
      damaged: {
        restingTremor: true,
        rigidity: 'cogwheel',
        movementSpeed: 'bradykinetic',
        posturalStability: 'unstable',
        behavior: 'Starts fast and wide, then rapidly slows and shrinks in size with each successive tap',
        report: '"I\'m trying to keep it up — it just runs out of steam."',
      },
      explanation:
        'This progressive slowing and shrinking within a single burst of repeated movement — ' +
        'not just slowness overall — is a hallmark of bradykinesia. The basal ganglia normally ' +
        'sustain the size and speed of a repeated movement; without enough dopamine, each ' +
        'repetition decays a little further than the last.',
      dayToDay:
        'Handwriting that starts normal-sized and trails off into smaller and smaller letters by ' +
        'the end of a line is the same phenomenon, called micrographia.',
      sources: [
        {
          claim:
            'Bradykinesia in Parkinson\'s disease characteristically includes progressive ' +
            'decrement in amplitude and speed with repetitive movement, distinct from simple slowness.',
          citation: 'Jankovic (2008), Journal of Neurology, Neurosurgery & Psychiatry',
          url: 'https://doi.org/10.1136/jnnp.2007.131045',
        },
      ],
    },
  ],
  plasticity: {
    mechanism:
      'Levodopa restores the missing dopamine signal directly, and for years it can make ' +
      'movement look close to normal again — sometimes called the honeymoon period. But it ' +
      'does not slow the underlying loss of dopamine neurons, and the response to the same ' +
      'dose gradually changes character. Years in, its benefit narrows into a shorter window ' +
      'after each dose, and involuntary extra movements — dyskinesias — can appear exactly ' +
      'when the drug is working hardest.',
    timeline: [
      { week: 0, recoveryFraction: 0 },
      { week: 4, recoveryFraction: 0.75 },
      { week: 52, recoveryFraction: 0.8 },
      { week: 260, recoveryFraction: 0.6 },
      { week: 520, recoveryFraction: 0.45 },
    ],
    caveat:
      'This tracks how well levodopa controls movement, not how much dopamine has actually ' +
      'been restored — the neurons themselves keep dying underneath the whole time. The early ' +
      'response can look remarkably close to normal. A decade in, the same dose covers a ' +
      'narrower window and can bring dyskinesias along with the relief.',
  },
  sources: [
    {
      claim:
        "Motor symptoms of Parkinson's disease emerge only after substantial, often 60-80%, " +
        'loss of dopaminergic neurons in the substantia nigra.',
      citation: 'Fearnley & Lees (1991), Brain',
      url: 'https://doi.org/10.1093/brain/114.5.2283',
    },
    {
      claim:
        'Long-term levodopa therapy is complicated by motor fluctuations (wearing-off) and ' +
        'dyskinesias that emerge years into treatment.',
      citation: 'Obeso et al. (2000), Trends in Neurosciences',
      url: 'https://doi.org/10.1016/S0166-2236(00)01650-1',
    },
  ],
};

export default parkinsons;
