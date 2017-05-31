####
# Extracts spectrograms from raw audio file and exports pickled data
#	 param 1: raw audio file path
#	 param 2: Resample if necessary?
###

from pylab import *
from scipy.io import wavfile
from scipy.signal import *
from scipy import *
import matplotlib
import sys
import os
import pickle

import params

def getMax(arr):
	_max = -1.
	for i in range(0, len(arr)):
		for j in range(0, len(arr[0])):
			if (arr[i,j] > _max):
				_max = arr[i,j]
	return _max

def extractSpectrogram(rawAudioPath, doResample=False) :
	originalSampleFreq, audioData = wavfile.read(rawAudioPath)

	# If sample rate different from the standart one, resamples.
	if originalSampleFreq != params.SAMPLE_RATE:
		if doResample:
			print "Resampling..."
			"""audioData = resample(audioData,
				int(float(len(audioData)) * float(params.SAMPLE_RATE) / float(originalSampleFreq)))"""

			newFilePath = rawAudioPath[:-4] + "_resamp.wav"
			print("sox " + rawAudioPath + " -r " + str(params.SAMPLE_RATE) + " " + newFilePath)
			os.system("sox " + rawAudioPath + " -r " + str(params.SAMPLE_RATE) + " " + newFilePath)
			originalSampleFreq, audioData = wavfile.read(newFilePath)
		else:
			return None

	audioData = audioData / (2.**15) # Map values into [-1, 1]
	spectrograms = np.empty((len(audioData) / params.WINDOW_SIZE, params.WINDOW_SIZE))

	print "Extracting spectrogram..."
	for i in range(0, len(audioData) / params.WINDOW_SIZE):
		spectrograms[i,:] = abs( np.fft.fft(audioData[i*params.WINDOW_SIZE:(i+1)*params.WINDOW_SIZE]) )

	return spectrograms

if __name__ == "__main__":
    extractSpectrogram(sys.argv[1], sys.argv[2])