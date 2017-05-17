####
# Appends pickled data to LMDB file
#	 param 1: pickle file path
#	 param 2: output file path
###

import numpy as np
import lmdb
import caffe
import pickle
import sys
import random

import params

def toLMDB(pickleFilePath, outputFilePath):
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
	        #str_id = '{:08}'.format(i)
	        str_id = '{:05}'.format(random.randint(1,99000))+'{:05}'.format(i) # shuffle data
	        txn.put(str_id.encode('ascii'), datum.SerializeToString())

if __name__ == "__main__":
    toLMDB(sys.argv[1], sys.argv[2])