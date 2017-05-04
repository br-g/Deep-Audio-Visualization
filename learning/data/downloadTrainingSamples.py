# Downloads some youtube music from various youtube playlists
#	 param 1: number of videos to download

from __future__ import unicode_literals
import sys
import commands
from random import randint, shuffle

# Loads playlists
with open("./playlists.txt", "r") as f:
    playlists = []
    for line in f:
        playlists.append(line)
    playlists = [x.strip() for x in playlists] 
    shuffle(playlists)

# Download music from various youtube playlists.
# Audio only, best possible quality
for i in range(0, int(sys.argv[1])):
    print("--- download " + repr(i))
    try:
        playlistInd = randint(1,500)
    	commands.getstatusoutput("youtube-dl \
            --ignore-errors \
            --audio-quality 0 \
            -x \
            -o '/home/bruno/KTH/computer-graphics/Autoencoders-Music-Visualization/training/data/raw_audio/m" + repr(i) + ".%(ext)s' \
            --audio-format wav \
            --playlist-start " + repr(playlistInd) + " --playlist-end " + repr(playlistInd) + " "\
            + playlists[i % len(playlists)])
    except:
        print("Error during download")