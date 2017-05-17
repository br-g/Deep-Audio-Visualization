####
# Adds random training samples to LMDB.
#	 param 1: output LMDB file path
#	 param 2: number of samples to add
#	 param 3: batch size
###

import sys
import os
import downloadTrainingSamples
import extractSpectrograms
import toLMDB

def emptyFolder(path):
	filelist = [ f for f in os.listdir(path) ]
	for f in filelist:
	    os.remove(path + "/" + f)

def addTrainingSamples(LmdbfilePath, nbSamples):
	emptyFolder('../raw_audio')
	downloadTrainingSamples.downloadFromYouTube('../raw_audio/m', batchSize)

	filelist = [ f for f in os.listdir('../raw_audio') ]
	for f in filelist:
		os.system('./rawAudioToMono.sh ../raw_audio/' + f)
		os.remove('../raw_audio/' + f)

	emptyFolder('../spectro_data')
	filelist = [ f for f in os.listdir('../raw_audio') ]
	for f in filelist:
		pickleFilePath = '../spectro_data/' + f[:-4] + '.pk'
		extractSpectrograms.extractSpectrogram('../raw_audio/' + f, pickleFilePath)
		toLMDB.toLMDB(pickleFilePath, LmdbfilePath)

if __name__ == "__main__":
	LmdbfilePath = sys.argv[1];
	nbSamples = int(sys.argv[2]);
	batchSize = int(sys.argv[3]);

	for i in range(0, nbSamples / batchSize):
		addTrainingSamples(LmdbfilePath, batchSize)