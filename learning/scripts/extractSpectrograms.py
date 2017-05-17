####
# Extracts spectrograms from raw audio file and exports pickled data
#	 param 1: raw audio file path
#	 param 2: output file path
###

from pylab import *
from scipy.io import wavfile
from scipy.signal import spectrogram, resample
import matplotlib
import sys
import pickle

import params

def extractSpectrogram(rawAudioPath, outFilePath) :
	originalSampleFreq, audioData = wavfile.read(rawAudioPath)

	# If sample rate different from the standart one, resamples.
	if originalSampleFreq != params.SAMPLE_RATE:
		print "Resampling..."
		audioData = resample(audioData,
			int(float(len(audioData)) * float(params.SAMPLE_RATE) / float(originalSampleFreq)))

	audioData = audioData / (2.**15) # Map values into [-1, 1]
	spectrograms = np.empty((len(audioData) / params.WINDOW_SIZE, params.WINDOW_SIZE))

	print "Extracting spectrogram..."
	for i in range(0, len(audioData) / params.WINDOW_SIZE):
		spectrograms[i,:] = abs( np.fft.fft(audioData[i*params.WINDOW_SIZE:(i+1)*params.WINDOW_SIZE]) ) * 1000.

	print "Pickling data..."
	pickle.dump(spectrograms, open(outFilePath, "w"))

if __name__ == "__main__":
    extractSpectrogram(sys.argv[1], sys.argv[2])