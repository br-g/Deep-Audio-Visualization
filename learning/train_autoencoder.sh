#!/usr/bin/env sh
set -e

../lib/caffe/build/tools/caffe train \
  --solver=./autoencoder_solver.prototxt $@