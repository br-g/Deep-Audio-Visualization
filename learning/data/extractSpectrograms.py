from pylab import *
from scipy.io import wavfile
from scipy.signal import spectrogram
import matplotlib
import sys
import pickle

windowSize = 512

rawAudioPath = sys.argv[1]
outFilePath = sys.argv[2]

sampFreq, sound = wavfile.read(rawAudioPath)

sound = sound / (2.**15) # Map values into [-1, 1]

n = len(sound)
spectrograms = np.empty((len(sound) / windowSize, windowSize))

print "Extracting spectrogram..."
for i in range(0, len(sound) / windowSize):
	spectrograms[i,:] = abs( np.fft.fft(sound[i*windowSize:(i+1)*windowSize]) ) * 1000.

print "Pickling data..."
pickle.dump(spectrograms, open(outFilePath, "w"))

"""for i in range (0, 10):
	freqArray = arange(0, windowSize, 1.0);
	plot(freqArray, spectrograms[i,:], color='k')
	plt.show()"""