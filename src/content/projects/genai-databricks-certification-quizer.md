---
title: Databricks GenAI certification quizer
description: A Streamlit practice tool for the Databricks Certified Generative AI Engineer Associate exam, with ready-to-use question banks generated from the course materials.
order: 3
featured: true
tags: [python, streamlit, llm, databricks]
repo: https://github.com/edugonza/GenAI-Databricks-Certification-Quizer
status: active
---

It asks single-choice and multi-select questions one at a time and explains each answer. At
the end of a session it shows your score, accuracy per lesson and how you did compared with
past sessions, and flags lessons below 70% as weak spots. The question banks were generated
with an LLM. The course materials were first parsed into Markdown: HTML lessons directly,
slide decks with Claude, and videos transcribed locally with Whisper.
