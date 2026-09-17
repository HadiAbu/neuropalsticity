import type { MemoryContent } from '@content/schema';

const hippocampus: MemoryContent = {
  kind: 'memory',
  id: 'hippocampus',
  name: 'Hippocampus',
  plainName: 'the hippocampus',
  overview:
    'A curled, seahorse-shaped structure on each side of the brain, tucked deep in the ' +
    'temporal lobe. It is where a passing moment becomes a lasting memory.',
  insight:
    'Memory is not one thing. Remembering a face, learning a skill, and knowing who you are ' +
    'are handled by different systems. The hippocampus writes only one of them — the story ' +
    'of what happened, when. Destroy it and the others can carry on entirely without it.',
  premise:
    'In this level both hippocampi are destroyed, as they were, deliberately, in the most ' +
    'famous case in neuroscience: patient H.M., whose temporal lobes were removed in 1953 to ' +
    'treat severe epilepsy. He lived fifty-five more years and could never again make a new ' +
    'lasting memory.',
  trials: [
    {
      id: 'repeated-introduction',
      label: 'The same physiotherapist, every day for a month',
      description:
        'Each session she reintroduces herself before they begin. This has happened roughly ' +
        'twenty times now.',
      choices: [
        { id: 'recognizes', label: 'Greets her by name, asks about her week', correct: false },
        { id: 'stranger', label: 'Treats her as a stranger, every single time', correct: true },
        { id: 'vague', label: 'Finds her face familiar but cannot place her', correct: false },
        { id: 'annoyed', label: 'Grows frustrated at being reintroduced so often', correct: false },
      ],
      intact: {
        formsNewMemory: true,
        retainsOldMemories: true,
        learnsSkillsProcedurally: true,
        behavior: 'Greets her by name and asks how her week went',
        report: '"Good to see you again — how did the marathon training go?"',
      },
      damaged: {
        formsNewMemory: false,
        retainsOldMemories: true,
        learnsSkillsProcedurally: true,
        behavior: 'Introduces herself as if meeting a stranger, every time',
        report: '"Nice to meet you. Have we done this before?"',
      },
      explanation:
        'The hippocampus is what converts an experience into a stored memory — a kind of save ' +
        'button. Without it, each session is fully real while it happens; nothing about it ' +
        'gets written down for later. Twenty sessions leave no trace at all.',
      dayToDay:
        'Every conversation is complete and genuine in the moment, and gone the instant a new ' +
        'one begins. Life becomes a sequence of unconnected nows.',
      sources: [
        {
          claim:
            'Bilateral hippocampal removal produces severe anterograde amnesia: an inability ' +
            'to form new lasting declarative memories, while intelligence and personality ' +
            'remain intact.',
          citation: 'Scoville & Milner (1957), Journal of Neurology, Neurosurgery & Psychiatry',
          url: 'https://doi.org/10.1136/jnnp.20.1.11',
        },
      ],
    },
    {
      id: 'mirror-tracing',
      label: 'Practising a mirror-tracing puzzle, once a day for a week',
      description:
        'The task: trace a star shape while watching only its mirror reflection — ' +
        'disorienting and slow at first for anyone.',
      choices: [
        { id: 'no-learning', label: 'Never improves — the skill also fails to form', correct: false },
        { id: 'improves-recalls', label: 'Gets faster each day and remembers practising yesterday', correct: false },
        { id: 'improves-forgets', label: 'Gets faster and cleaner each day, yet insists every day it is the first attempt', correct: true },
        { id: 'forgets-skill', label: 'Improves at first, then loses the skill again overnight', correct: false },
      ],
      intact: {
        formsNewMemory: true,
        retainsOldMemories: true,
        learnsSkillsProcedurally: true,
        behavior: 'Improves daily and recalls practising the day before',
        report: '"I remember this — I was terrible at it yesterday."',
      },
      damaged: {
        formsNewMemory: false,
        retainsOldMemories: true,
        learnsSkillsProcedurally: true,
        behavior: 'Traces faster and more accurately every day, while insisting each day is the first attempt',
        report: '"I don\'t believe I\'ve ever done this before — but look, my hand knows exactly what to do."',
      },
      explanation:
        'Skill learning — procedural memory — runs on different circuitry, largely the basal ' +
        'ganglia and cerebellum, not the hippocampus. One system quietly writes the skill; a ' +
        'separate one would normally write the story of practising it. Destroy only the ' +
        'second, and the hand keeps learning while the mind insists it never tried before.',
      dayToDay:
        'New physical and cognitive skills can still be built through practice, genuinely and ' +
        'permanently — but never with any memory of having practised them.',
      sources: [
        {
          claim:
            'Patient H.M. showed clear day-over-day improvement on mirror-tracing tasks despite ' +
            'no conscious recollection of prior practice, demonstrating a hippocampus-independent ' +
            'procedural memory system.',
          citation: 'Milner (1962), in Physiologie de l\'Hippocampe',
        },
      ],
    },
    {
      id: 'childhood-recall',
      label: 'Asked about this morning, then asked about childhood',
      description:
        'Two questions, minutes apart: "What did you have for breakfast?" and "Tell me about ' +
        'the house you grew up in."',
      choices: [
        { id: 'both-clear', label: 'Answers both questions in full detail', correct: false },
        { id: 'breakfast-only', label: 'Recalls breakfast vividly but draws a blank on childhood', correct: false },
        { id: 'childhood-only', label: 'Cannot recall breakfast, but describes childhood in vivid detail', correct: true },
        { id: 'neither', label: 'Draws a blank on both questions', correct: false },
      ],
      intact: {
        formsNewMemory: true,
        retainsOldMemories: true,
        learnsSkillsProcedurally: true,
        behavior: 'Answers both without hesitation',
        report: '"Toast and coffee. And our house on Elm Street had a red door and a huge oak out front."',
      },
      damaged: {
        formsNewMemory: false,
        retainsOldMemories: true,
        learnsSkillsProcedurally: true,
        behavior: 'Draws a total blank on the morning; describes childhood freely and in detail',
        report: '"Breakfast? I couldn\'t tell you. But our house on Elm Street had a red door and a huge oak out front."',
      },
      explanation:
        'The hippocampus is a way-station, not the archive. A new experience passes through it ' +
        'on the way to long-term storage elsewhere in the cortex. Memories laid down years ' +
        'earlier have already been filed away and no longer need it — which is why the ' +
        'distant past can survive intact while this morning cannot be written down at all.',
      dayToDay:
        'Identity and the distant past stay whole — he still knows exactly who he is — while ' +
        'the recent past continuously disappears, sometimes within seconds.',
      sources: [
        {
          claim:
            'Memories become progressively less dependent on the hippocampus as they are ' +
            'consolidated into cortical storage over time, explaining temporally graded ' +
            'retrograde amnesia after hippocampal damage.',
          citation: 'Squire & Alvarez (1995), Current Opinion in Neurobiology',
          url: 'https://doi.org/10.1016/0959-4388(95)80023-9',
        },
      ],
    },
  ],
  plasticity: {
    mechanism:
      'The hippocampus itself does not regrow the ability to form new lasting memories once ' +
      'both sides are gone — that capacity does not return. What changes is everything built ' +
      'around the gap: notebooks, labelled photographs, a consistent daily routine, and ' +
      'family who repeat context instead of assuming it will be recalled. The world starts ' +
      'doing the remembering the hippocampus used to do alone.',
    timeline: [
      { week: 0, recoveryFraction: 0 },
      { week: 4, recoveryFraction: 0.12 },
      { week: 12, recoveryFraction: 0.3 },
      { week: 26, recoveryFraction: 0.48 },
      { week: 52, recoveryFraction: 0.62 },
      { week: 104, recoveryFraction: 0.7 },
    ],
    caveat:
      'This tracks external memory strategies adopted, not memory regained. Even years on, a ' +
      'new fact or a new face still has to be written down the instant it happens, or it is ' +
      'gone for good.',
  },
  sources: [
    {
      claim:
        'Patient H.M. remained a central case in memory research for over fifty years, ' +
        'establishing that memory is composed of multiple, dissociable systems.',
      citation: 'Corkin (2002), Nature Reviews Neuroscience',
      url: 'https://doi.org/10.1038/nrn726',
    },
  ],
};

export default hippocampus;
