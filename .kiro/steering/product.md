---
inclusion: always
---

# Product

**What this is:** neuropalsticity — an interactive 3D web game that teaches how the brain
and nervous system work by letting people *cause and observe effects*, not read facts.

**Core promise:** every topic is learned through a scenario. The player does something
(damages a region, administers a drug, disrupts a circuit), predicts what will happen,
and then watches the consequence play out on a 3D brain and body.

**Audience:** general curious public, students (bio/psych/pre-med), and families affected
by brain conditions. Accessible with no assumed background, but accurate enough that a
student gets real value. Never condescending, never a textbook.

## Content Themes

| Theme | Covers |
|---|---|
| A — Regions & Functions | motor cortex, somatosensory cortex, visual cortex, Broca's/Wernicke's, prefrontal cortex, hippocampus, amygdala, cerebellum, basal ganglia, hypothalamus/brainstem |
| B — Drugs & the Brain | organized by neurotransmitter system: stimulants (dopamine), depressants/GABA, opioids, hallucinogens (serotonin), SSRIs |
| C — Mental Illness & Brain Damage | Parkinson's, depression, PTSD, Alzheimer's, aphasia, schizophrenia — each mapped onto Theme A regions |

Themes B and C reuse Theme A's 3D assets and region definitions. Build Theme A first.

## Neuroplasticity Is a Mechanic, Not a Level

The project's namesake is **not** a standalone section. Every scenario closes with a
plasticity beat: how the brain adapts, rewires, or recovers — critical periods,
rehab-driven recovery, adult plasticity. No level ends on damage alone. Every level ends
on adaptation.

## Tone

Warm, curious, plain-language. Explain like a good museum exhibit, not a lecture. Real
anatomical and clinical accuracy — never sacrifice a fact to make a scenario cuter.
When a topic touches real suffering (addiction, mental illness, brain injury), write with
empathy and without sensationalism.

## Visual Direction

Stylized but scientifically honest. Real anatomical proportions and real effects, rendered
with clean, appealing game art — not photoreal medical imagery, not cartoon.

## Non-Goals (for now)

No accounts, no backend, no database, no leaderboards, no multiplayer, no analytics,
no mobile app. Progress is client-side only. Do not add a server without a spec.

## Build-Time AI

Claude Fable 5.1 is used as a **build-time content generation tool** — authoring level
copy, scenario text, and deficit descriptions against the typed content schema. It is
**not** a runtime dependency. The shipped game makes no LLM API calls.
