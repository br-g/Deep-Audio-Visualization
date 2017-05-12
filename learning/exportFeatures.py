####
# Extracts features from raw audio and export it in JSON
###

import numpy as np
import caffe
from pylab import *
from scipy.io import wavfile
from scipy.signal import spectrogram, resample
import matplotlib
import json
import sys
sys.path.insert(0, './data')
import params

rawAudioPath = sys.argv[1]
outFilePath = sys.argv[2]
modelPath = sys.argv[3]
musicTitle = sys.argv[4]
musicArtist = sys.argv[5]

####
# Extracts spectrograms from raw audio
###
originalSampleFreq, audioData = wavfile.read(rawAudioPath)

# If sample rate different from the standart one, resamples.
if originalSampleFreq != params.SAMPLE_RATE:
	print "Resampling..."
	audioData = resample(audioData,
		int(float(len(audioData)) * float(params.SAMPLE_RATE) / float(originalSampleFreq)))

audioData = audioData / (2.**15) # Map values into [-1, 1]
step = int(params.SAMPLE_RATE / params.MAX_FPS)
spectrograms = np.empty((len(audioData) / step, params.WINDOW_SIZE))

print "Extracting spectrogram..."
for i in range(0, len(audioData) / step):
	spectrograms[i,:] = abs( np.fft.fft(audioData[i*step:i*step+params.WINDOW_SIZE]) ) * 1000.


####
# Runs the model and get features
###
features = np.empty((len(audioData) / step, params.NB_FEATURES))

if params.USE_GPU:
    caffe.set_device(0)
    caffe.set_mode_gpu()
else:
    caffe.set_mode_cpu()

net = caffe.Net('models/autoencoder.prototxt',
                'snapshots/autoencoder__iter_50000.caffemodel',
                caffe.TEST)


print "Computing features..."

def netForward(batch):
	initialBatchSize = len(batch)
	if (initialBatchSize < params.BATCH_SIZE):
		newBatch = np.empty((params.BATCH_SIZE, params.WINDOW_SIZE))
		newBatch[0:initialBatchSize] = batch
		batch = newBatch

	net.blobs['data'].data[...] = np.reshape(batch, (params.BATCH_SIZE,1,1,params.WINDOW_SIZE))
	return net.forward(end="encode2")['encode2'][0:initialBatchSize]

for i in range(0, len(spectrograms) / params.BATCH_SIZE):
	startInd = i*params.BATCH_SIZE
	endInd = startInd + params.BATCH_SIZE
	features[startInd:endInd,:] = netForward(spectrograms[startInd:endInd,:])
if len(spectrograms) % params.BATCH_SIZE > 0:
	startInd = int(len(spectrograms)/params.BATCH_SIZE)*params.BATCH_SIZE
	features[startInd:,:] = netForward(spectrograms[startInd:,:])

####
# Normalizes features
###
print "Normalizing..."

for i in range(0, params.NB_FEATURES):
	_max = max(features[:,i])
	_min = min(features[:,i])
	features[:,i] = np.around((features[:,i] - _min) / (_max - _min), params.FEATURES_PRECISION_DIGITS)

####
# Exports features in JSON
###
print "Exporting in JSON..."

def exportJSON():
	def exportFeatures():
		def exportFrame(frame):
			featureString = "["
			for feature in frame[:-1]:
				featureString += str(feature) + ","
			featureString += str(frame[-1])
			featureString += "]"
			return featureString
		featuresString = "["
		for frame in features[:-1]:
			featuresString += exportFrame(frame) + ","
		featuresString += exportFrame(features[-1])
		featuresString += "]"
		return featuresString

	jsonString = "{"
	jsonString += "\"Title\":" + json.dumps(musicTitle) + ","
	jsonString += "\"Artist\":" + json.dumps(musicArtist) + ","
	jsonString += "\"FPS\":\"" + str(params.MAX_FPS) + "\","
	jsonString += "\"Features\":" + exportFeatures()
	jsonString += "}"
	return jsonString

with open(outFilePath, 'w') as outfile:
    outfile.write(exportJSON())

print "Done"