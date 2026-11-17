# TraceBack user-validation protocol

**Purpose:** collect honest, reproducible evidence for the Codegeist Impact and Design judging dimensions. This is a study plan, not a claim that users have already tested TraceBack.

## Study design

Run an exploratory, within-participant usability pilot with **5–8 software engineers** who have investigated Jira incidents or delivery regressions before. This sample is suitable for finding usability problems and estimating workflow friction; it is not large enough to claim population-wide time savings.

Use two comparable, de-identified issues in a dedicated test site. Each issue must have real Jira relationships and, where the test site supports it, genuine Teamwork Graph linked records. Do not fabricate telemetry, deployments, pull requests, goals, or logs and present them as live integrations. Record which source types are genuinely connected before the session.

Counterbalance task order:
- Half of participants use the normal Jira workflow for scenario A, then TraceBack for scenario B.
- The other half use TraceBack for scenario A, then the normal workflow for scenario B.
- Keep scenario complexity comparable and disclose any difference.

## Participant task

Give each participant the same task statement:

> “Investigate this Jira incident. Identify the relevant linked work and delivery evidence, decide what you would verify next, and explain what you still do not know. Do not make changes to production.”

Do not coach participants during the timed task. Ask them to think aloud only if doing so will not distort the time measurement; if used, apply it consistently to both conditions.

## Measures

Record raw observations per participant and per scenario:

1. **Task completion time:** start when the issue opens; stop when the participant gives a defensible investigation summary or reaches the time limit.
2. **Context switches:** count distinct tool/product changes needed to inspect the evidence.
3. **Source traceability:** proportion of factual findings for which the participant can open the original source.
4. **Evidence-state accuracy:** whether the participant correctly distinguishes available, empty, partial, and unavailable data.
5. **Causality discipline:** whether the participant avoids claiming that temporal proximity or a Jira link proves root cause.
6. **Task success:** whether the participant identifies the evidence-supported next verification step and explicitly states important unknowns.
7. **Usability issues:** confusion, dead ends, unclear labels, accessibility problems, or incorrect assumptions caused by the interface.

Do not turn these measures into a single composite score unless the scoring rule is defined before the study.

## Session record template

| Participant ID | Condition order | Scenario | Time (seconds) | Context switches | Sources opened / factual findings | Evidence-state errors | Unsupported causal claims | Task completed? | Notes |
| --- | --- | --- | ---: | ---: | --- | ---: | ---: | --- | --- |
| P01 |  |  |  |  |  |  |  |  |  |
| P02 |  |  |  |  |  |  |  |  |  |
| P03 |  |  |  |  |  |  |  |  |  |
| P04 |  |  |  |  |  |  |  |  |  |
| P05 |  |  |  |  |  |  |  |  |  |

Use anonymous participant IDs. Do not record names, emails, customer identifiers, or confidential incident details in the report.

## Analysis and reporting

Report:
- participant count and relevant experience criteria;
- the two scenarios and task-order allocation;
- median and range of completion time for each condition;
- median context switches for each condition;
- source traceability and evidence-state accuracy;
- number and examples of unsupported causal claims;
- observed usability problems and fixes;
- limitations, including small sample size, scenario differences, and test-site constraints.

Only claim a measured improvement if the raw records support it. If the result is mixed or inconclusive, say so. Never invent participant results or percentages.

## Release gate

Do not use study results in the public submission until:
- the current app build has passed live acceptance;
- all participants used the same documented build;
- the test data and source records are verified;
- raw observations and calculations are retained in the project;
- the final wording accurately describes the pilot's size and limitations.
