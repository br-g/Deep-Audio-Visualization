####
# Appends pickled data to LMDB file
###

import numpy as np
import lmdb
import caffe
import pickle
import sys

import params

pickleFilePath = sys.argv[1]
outputFilePath = sys.argv[2]

spectrograms = pickle.load(open(pickleFilePath, "r"))
N = len(spectrograms)

# Sets map size to 20 GB
map_size = 20 * 1024 * 1024 * 1024

env = lmdb.open(outputFilePath, map_size=map_size)

with env.begin(write=True) as txn:
    for i in range(N):
        datum = caffe.proto.caffe_pb2.Datum()
        datum.channels = 1
        datum.height = 1
        datum.width = params.WINDOW_SIZE
        datum.data = spectrograms[i,:].tobytes()
        str_id = '{:08}'.format(i)
        txn.put(str_id.encode('ascii'), datum.SerializeToString())