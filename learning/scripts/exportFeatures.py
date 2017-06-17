####
# Extracts features from raw audio and exports it in JSON
###

import numpy as np
import caffe
from pylab import *
from scipy.io import wavfile
from scipy.signal import spectrogram, resample
import matplotlib
import json
import sys
import os
import params
import extractSpectrograms
import jsonpickle

rawAudioPath = sys.argv[1]
outFilePath = sys.argv[2]
modelPath = sys.argv[3]
snapshotPath = sys.argv[4]

# Features container
class Features:
   def __init__(self, sampleRate):
      self.sampleRate = sampleRate
      self.featuresData = {}

####
# Extracts spectrograms from raw audio
###
originalSampleFreq, audioData = wavfile.read(rawAudioPath)

# If sample rate different from the standart one, resamples.
if originalSampleFreq != params.SAMPLE_RATE:
	print "Resampling..."
	#audioData = resample(audioData,
	#	int(float(len(audioData)) * float(params.SAMPLE_RATE) / float(originalSampleFreq)))
	newFilePath = rawAudioPath[:-4] + "_resamp.wav"
	os.system("sox " + rawAudioPath + " -r " + str(params.SAMPLE_RATE) + " " + newFilePath)
	originalSampleFreq, audioData = wavfile.read(newFilePath)

audioData = audioData / (2.**15) # Map values into [-1, 1]
step = int(params.SAMPLE_RATE / params.MAX_FPS)
spectrograms = np.empty((len(audioData) / step, params.WINDOW_SIZE))

print "Extracting spectrogram..."
for i in range(0, len(audioData) / step):
	if i*step+params.WINDOW_SIZE <= len(audioData):
		spectrograms[i,:] = abs( np.fft.fft(audioData[i*step:i*step+params.WINDOW_SIZE]) )


####
# Runs the model and gets features
###
features = np.empty((len(audioData) / step, params.NB_FEATURES))

if params.USE_GPU:
    caffe.set_device(0)
    caffe.set_mode_gpu()
else:
    caffe.set_mode_cpu()

net = caffe.Net(modelPath,
                snapshotPath,
                caffe.TEST)


print "Computing features..."

def netForward(batch):
	initialBatchSize = len(batch)
	if (initialBatchSize < params.BATCH_SIZE):
		newBatch = np.empty((params.BATCH_SIZE, params.WINDOW_SIZE))
		newBatch[0:initialBatchSize] = batch
		batch = newBatch

	net.blobs['data'].data[...] = np.reshape(batch, (params.BATCH_SIZE,1,1,params.WINDOW_SIZE))
	return net.forward(end="encode7")['encode7'][0:initialBatchSize]

for i in range(0, len(spectrograms) / params.BATCH_SIZE):
	startInd = i*params.BATCH_SIZE
	endInd = startInd + params.BATCH_SIZE
	features[startInd:endInd,:] = netForward(spectrograms[startInd:endInd,:])

if len(spectrograms) % params.BATCH_SIZE > 0:
	startInd = int(len(spectrograms)/params.BATCH_SIZE)*params.BATCH_SIZE
	features[startInd:,:] = netForward(spectrograms[startInd:,:])


####
# Creates features object and computes blur
###	
print "Computing blur..."

featuresContainer = Features(params.MAX_FPS)
blurLevels = [1, 10, 50, 100, 300, 1000, 3000]

for blurValue in blurLevels:
	featuresContainer.featuresData["blur" + str(blurValue)] = np.zeros((len(features), params.NB_FEATURES))

	for curFrameInd in range(0, len(features)):
		minBound = int(math.ceil(curFrameInd-0.5*blurValue))
		if minBound < 0:
			minBound = 0
		maxBound = int(math.ceil(curFrameInd+0.5*blurValue))
		if maxBound > len(features):
			maxBound = len(features)

		for curFeatureInd in range(0, params.NB_FEATURES):
			meanValue = np.mean(features[minBound:maxBound, curFeatureInd])
			featuresContainer.featuresData["blur" + str(blurValue)][curFrameInd, curFeatureInd] = meanValue

####
# Normalizes features
###
print "Normalizing..."

for blurValue in blurLevels:
	for curFeatureInd in range(0, params.NB_FEATURES):
		_max = max(featuresContainer.featuresData["blur" + str(blurValue)][:,curFeatureInd])
		_min = min(featuresContainer.featuresData["blur" + str(blurValue)][:,curFeatureInd])
		featuresContainer.featuresData["blur" + str(blurValue)][:,curFeatureInd] = np.around((featuresContainer.featuresData["blur" + str(blurValue)][:,curFeatureInd] - _min) / (_max - _min), params.FEATURES_PRECISION_DIGITS)

for blurValue in blurLevels:
	featuresContainer.featuresData["blur" + str(blurValue)] = featuresContainer.featuresData["blur" + str(blurValue)].tolist()

####
# Exports features in JSON
###
print "Exporting in JSON..."

"""def exportJSON():
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
	jsonString += "\"FPS\":\"" + str(params.MAX_FPS) + "\","
	jsonString += "\"Features\":" + exportFeatures()
	jsonString += "}"
	return jsonString"""

with open(outFilePath, 'w') as outfile:
    outfile.write(json.dumps(featuresContainer, default=lambda o: o.__dict__))

print "Done"