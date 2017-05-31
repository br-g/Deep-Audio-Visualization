# Downloads some youtube music from various youtube playlists
#    param 1: downloaded files prefix
#    param 2: number of videos to download

from __future__ import unicode_literals
import sys
import commands
from random import randint, shuffle
import params

def downloadFromYouTube(outputPrefix, nbVideos):
    # Loads playlists
    with open("./playlists.txt", "r") as f:
        playlists = []
        for line in f:
            playlists.append(line)
        playlists = [x.strip() for x in playlists] 
        shuffle(playlists)

    # Download music from various youtube playlists.
    # Audio only, best possible quality
    for i in range(0, int(nbVideos)):
        print("Download " + repr(i))
        try:
            playlistInd = randint(1,500)
            commands.getstatusoutput("youtube-dl \
                --ignore-errors \
                --audio-quality 0 \
                -x \
                -o '" + outputPrefix + repr(i) + ".%(ext)s' \
                --audio-format wav \
                --playlist-start " + repr(playlistInd) + " --playlist-end " + repr(playlistInd) + " "\
                + playlists[i % len(playlists)])
        except:
            print("Error during download")

if __name__ == "__main__":
    downloadFromYouTube(sys.argv[1], int(sys.argv[2]))