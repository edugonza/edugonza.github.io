---
title: Matrix chatbot template
description: A template for LLM-powered Matrix bots with end-to-end encryption, cross-signing and interactive verification, so you can verify the bot from Element like any other contact.
order: 1
featured: true
tags: [python, rust, matrix, ai-agents, llm]
repo: https://github.com/edugonza/chatbot-template
status: active
---

Built on [matrix-rust-sdk](https://github.com/matrix-org/matrix-rust-sdk) through a small
PyO3 bridge, because `matrix-nio` can't do cross-signing or in-room verification. The bot
itself is plain asyncio Python with chat commands, tool calling and per-room history. It runs
on Gemini by default, but you can swap in another LLM, and it deploys with Docker Compose.
I wrote about the reasoning behind it in
[Want to Chat with Your Agent? Join the Matrix](/blog/want-to-chat-with-your-agent-join-the-matrix/).
