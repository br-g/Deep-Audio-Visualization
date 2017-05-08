# Script adapted from CaffeJS

from __future__ import print_function
import fs
import json
import numpy as np

import sys
import os
import caffe

modelFileName = sys.argv[1]
snapshotFileName = sys.argv[2]
weightsDirName = sys.argv[3]

snapshotsDir  = "snapshots"
modelsDir  = "models"
weigthsDir  = "weights"

MODEL_FILE = '%s/%s' % (modelsDir, modelFileName)
PRETRAINED = '%s/%s' % (snapshotsDir, snapshotFileName)
WEIGHTS_DIR = '%s/%s/' % (weigthsDir, weightsDirName)

prev_shape = ()
net = caffe.Net(MODEL_FILE, PRETRAINED, 1) # gets net for run phase

def rot90(W):
    for i in range(W.shape[0]):
        for j in range(W.shape[1]):
            W[i, j] = np.rot90(W[i, j], 2)
    return W

for key in net.params:
  blobs = net.params[key]
  nb_filter = blobs[0].num
  stack_size = blobs[0].channels
  nb_col = blobs[0].height
  nb_row = blobs[0].width

  print("====> Layer: ", key)
  print("Expected Shape: ", nb_filter, stack_size, nb_col, nb_row)  
  print("Found Shape: ", np.array(blobs[0].data).shape)

  weights_p = blobs[0].data.reshape((nb_filter, stack_size, nb_col, nb_row)).astype(dtype=np.float32)
  weights_b = blobs[1].data.astype(dtype=np.float32)

  if len(weights_p.shape) > 2:
    # Caffe uses the shape f, (d, y, x)
    # ConvnetJS uses the shape f, (y, x, d)
    weights_p = np.swapaxes(np.swapaxes(weights_p, 3, 1), 2, 1)

  print("Converted to Shape: ", weights_p.shape)

  weights = {
    'filter': weights_p.reshape((nb_filter, stack_size*nb_col*nb_row)),
    'bias': weights_b
  }

  filename = WEIGHTS_DIR + key + '.bin'
  prev_shape = (nb_filter, stack_size, nb_col, nb_row)

  if not os.path.exists(filename):
    os.makedirs(filename)

  with open((filename + "_filter"), 'wb') as f:
    f.write(weights['filter'].astype(np.float32).tostring())

  with open((filename + "_bias"), 'wb') as f:
    f.write(weights['bias'].astype(np.float32).tostring())