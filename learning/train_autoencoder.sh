#!/usr/bin/env sh
set -e

../lib/caffe/build/tools/caffe train \
  --solver=./models/autoencoder_solver.prototxt $@