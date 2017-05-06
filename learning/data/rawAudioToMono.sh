#!/bin/bash

# Converts all downloaded raw audio files to mono
for entry in ./raw_audio/*
do
  if [[ $entry == *_mono.wav ]];
  then
    continue
  fi
  
  echo "Converting to mono: $entry"
  sox -v 0.5 "$entry" -c 1 "${entry::-4}_mono.wav"
  rm -f "$entry"
done