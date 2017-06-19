import glob
import json
import sys 

def read_mood_file(filename):
    # a mood file is a bunch of RGB triples
    with open(filename, 'rb') as infile:
        # just read the whole file
        inbytes = infile.read()

    # go through the data 3 bytes at a time
    colors = []
    sR = -1
    sG = -1
    sB = -1

    topRGB = []
    colorCounts = {}
    topRGBCount = 0

    for i in range(len(inbytes) / 3):
        offset = i * 3
        rgb = []
        simpleRgb = []
        for j in range(3):
            rgb.append(ord(inbytes[offset + j]))
        color = '|'.join(map(str, rgb))
        colors.append(color)

        for j in range(3):
            simpleRgb.append((rgb[j] // 13) * 13)

        color = '|'.join(map(str, simpleRgb))

        if not color in colorCounts:
            colorCounts[color] = 1
        elif reduce((lambda x, y: x * y), simpleRgb) > 39:
            colorCounts[color] += 1

        if colorCounts[color] > topRGBCount:
            topRGBCount = colorCounts[color]
            topRGB = simpleRgb[:]


    print(topRGB)
    # print(topRGBCount)
    print
    return topRGB

musicDir = sys.argv[1].decode("utf-8")
moodFileOutput = sys.argv[2].decode("utf-8")

moodFiles = glob.glob(musicDir + ".*.mood")
moodColors = {}
for moodFile in moodFiles:
    moodColors[moodFile] = read_mood_file(moodFile)

with open(moodFileOutput, 'w') as fp:
    json.dump(moodColors, fp, sort_keys=True, indent=2)