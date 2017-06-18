# Deep Audio Visualization

Live demo: https://bgodefroyfr.github.io/Deep-Audio-Visualization/web-app    
Projet report: https://github.com/BGodefroyFR/Deep-Audio-Visualization/blob/master/report.pdf

Audio visualization relies on feature extraction, such as spectrograms, timbre or pitch. Those are commonly hand-crafted and require engineering effort and prior knowledge. This project experiments the use of features automatically extracted by a deep neural network instead, using techniques that already demonstrated great potential for music classification and auto-tagging.

Demo crafted in Javascript, with *Three.js*. Deep learning is performed using *Caffe*.  
Animations use code stubs from [Charlie Hoey](http://charliehoey.com), [Felix Turner](http://airtight.cc) and [Jay Weeks](https://github.com/jpweeks/particulate-js).

## Installation (Unix)
* `git clone git@github.com:BGodefroyFR/Deep-Audio-Visualization.git`    
* `cd Deep-Audio-Visualization/web-app`   
* `http-server` (install it with *npm* if needed)
*  Open http://127.0.0.1:8080/index.html in *Chrome*
