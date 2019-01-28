# Deep Audio Visualization

Live demo: https://br-g.github.io/Deep-Audio-Visualization/web-app    

Audio visualization usually relies on hand-crafted features, like intensity, timbre or pitch. These metrics are defined by humans and are biased towards our cultural representation of sound.     
In this project, we have trained a Neural Net to generate these features directly from spectrograms, in an unsupervized way. We thus get rid of this bias and hope the resulting visualizations can help us perceive music in different ways.

The demo is built in Javascript, with *Three.js*. We used *Caffe* for deep learning.    
Animations relies on some code from [Charlie Hoey](http://charliehoey.com), [Felix Turner](http://airtight.cc) and [Jay Weeks](https://github.com/jpweeks/particulate-js).


## System overview
There is two distinct phases to generate the visualizations: feature extraction (computationally intensive, performed offline) and real-time visualization.     
Extracting features consists in computing a low dimensional representation of the audio input, that is, performing a lossy compression of sound. To do so, a stacked autoencoder is trained to generate a non-linear mapping, from spectrograms to small vectors. In this project, spectrograms are vectors of size 11,025 (for half a second of sound, at sample rate 22,050 Hz) that we compress to vectors of size 10 (for 10 features), using 7 layers. With a GPU, training the model and encoding songs takes a few minutes.

<p align="center">
<img align="center" src="https://github.com/br-g/Deep-Audio-Visualization/blob/master/doc/autoencoder_schema.jpg?raw=true" alt="Autoencoder schema" title="Autoencoder schema" height="150px">
</p>

Then, for each animation, generated features are mapped dynamically to parameters such as speed, size or color, in real time. Features and parameters are mapped randomly. This enables *10!* (~ 3.6 million) possible mappings and as many possible visualizations - each visit to the demo is a unique experience!


## Installation (Unix)
* `git clone git@github.com:br-g/Deep-Audio-Visualization.git`    
* `cd Deep-Audio-Visualization/web-app`   
* `http-server` (install it with *npm* if needed)
*  Open http://127.0.0.1:8080/index.html in *Chrome*
