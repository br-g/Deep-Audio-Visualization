#!/bin/bash

######
# Converts a raw audio files to mono
######

echo "Converting to mono: $1"
sox -v 0.5 "$1" -c 1 "${1::-4}_mono.wav"