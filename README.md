# Deep Audio Visualization

Live demo: https://bgodefroyfr.github.io/Deep-Audio-Visualization/web-app    
Detailed project: https://github.com/BGodefroyFR/Deep-Audio-Visualization/blob/master/doc/report.pdf

Audio visualization relies on feature extraction, such as spectrograms, timbre or pitch. Those are commonly hand-crafted and require engineering effort and prior knowledge. This project experiments the use of features automatically extracted by a deep neural network instead, using techniques that already demonstrated great potential for music classification and auto-tagging.

Demo crafted in Javascript, with *Three.js*. Deep learning is performed using *Caffe*.  
Animations use code stubs from [Charlie Hoey](http://charliehoey.com), [Felix Turner](http://airtight.cc) and [Jay Weeks](https://github.com/jpweeks/particulate-js).



## How it works
The system is composed of two main phases: feature extraction and real-time visualization.    
First, we need to compute a low dimensional representation of the audio input, that is, performing a lossy compression of sound. To do so, a stacked autoencoder is trained in an unsupervised way, providing a non-linear mapping, from spectrograms to small vectors. In practice, a spectrogram vector of size 11,025 (corresponding to half a second of sound, at sample rate 22,050 Hz) is reduced to 10 features, throughout 7 layers. On a GPU, training the model and encoding songs takes a few minutes.

<p align="center">
<img align="center" src="https://github.com/BGodefroyFR/Deep-Audio-Visualization/blob/master/doc/autoencoder_schema.jpg?raw=true" alt="Autoencoder schema" title="Autoencoder schema" height="150px">
</p>

Then, for each animation, these features are mapped dynamically to parameters such as speed, size or color, in real time. With random, we could generate *10!* (~ 3.6 million) possible mappings, and as many possible visualizations! Finally, for each parameter is defined a particular update frequency, from about 0.05 to 5 Hz to avoid over-reactivity and make movement fluid.


## Installation (Unix)
* `git clone git@github.com:BGodefroyFR/Deep-Audio-Visualization.git`    
* `cd Deep-Audio-Visualization/web-app`   
* `http-server` (install it with *npm* if needed)
*  Open http://127.0.0.1:8080/index.html in *Chrome*
