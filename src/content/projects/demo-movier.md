---
title: demo-movier
description: A pipeline that turns an edited demo video into one with burned-in subtitles and, optionally, a synthetic voice-over replacing the original audio.
order: 2
featured: true
tags: [python, speech-to-text, text-to-speech, ffmpeg]
repo: https://github.com/edugonza/demo-movier
status: active
---

It transcribes the audio with word-level timestamps, groups the words into subtitles and
cleans them up by removing filler words and joining fragments. It can then synthesise a new
voice from the refined script. The synthesised audio is transcribed again so the subtitle
timings match the new voice, then FFmpeg burns the subtitles in and swaps the audio track.
It uses Google Cloud Speech-to-Text and Text-to-Speech.
