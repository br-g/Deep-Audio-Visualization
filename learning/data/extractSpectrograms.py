####
# Extracts spectrograms from raw audio file and exports pickled data
###

from pylab import *
from scipy.io import wavfile
from scipy.signal import spectrogram
import matplotlib
import sys
import pickle

import params

params.WINDOW_SIZE = 512

rawAudioPath = sys.argv[1]
outFilePath = sys.argv[2]

sampFreq, sound = wavfile.read(rawAudioPath)

sound = sound / (2.**15) # Map values into [-1, 1]

n = len(sound)
spectrograms = np.empty((len(sound) / params.WINDOW_SIZE, params.WINDOW_SIZE))

print "Extracting spectrogram..."
for i in range(0, len(sound) / params.WINDOW_SIZE):
	spectrograms[i,:] = abs( np.fft.fft(sound[i*params.WINDOW_SIZE:(i+1)*params.WINDOW_SIZE]) ) * 1000.

print "Pickling data..."
pickle.dump(spectrograms, open(outFilePath, "w"))

"""for i in range (0, 10):
	freqArray = arange(0, params.WINDOW_SIZE, 1.0);
	plot(freqArray, spectrograms[i,:], color='k')
	plt.show()"""