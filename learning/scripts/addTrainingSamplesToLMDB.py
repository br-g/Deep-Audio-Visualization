####
# Adds random training samples to LMDB.
#	 param 1: output LMDB file path
#	 param 2: number of samples to add
#	 param 3: batch size
###

import sys
import extractSpectrograms
import toLMDB

def addTrainingSamples(rawAudiofilePath, lmdbPath):
	spectrograms = extractSpectrograms.extractSpectrogram(rawAudiofilePath, True)
	if spectrograms != None:
		toLMDB.toLMDB(spectrograms, lmdbPath)
	else:
		print("Error")

if __name__ == "__main__":
	rawAudiofilePath = sys.argv[1];
	lmdbPath = sys.argv[2];
	addTrainingSamples(rawAudiofilePath, lmdbPath)