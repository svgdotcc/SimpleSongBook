#!/bin/sh
#
# convert available .chordpro files to .png
# Usage: sh create_images.sh {subdirPath}
# if you want to log message use ... > log.txt 2>&1
#

SCRIPTDIR=$(readlink -f $(dirname $0))
echo $SCRIPTDIR

if [ -z "$1" ]; then 
  SUBDIR="$SCRIPTDIR/../songs/"
else
  SUBDIR=$1
fi

find $SUBDIR -name "*.chopro.ps-*.png" -exec rm -f {} \;
find $SUBDIR -name "*.chopro" -exec sh ./2png.sh {} \;

# rebuild Songs.js
echo "recreating ../lib/Songs.js ..."
cd $SCRIPTDIR/../
echo "window.SONGS = [" > ./lib/Songs.js
find ./songs/ -name "*.png" -printf "\047%p\047\054\n" >> ./lib/Songs.js
echo "'' // last empty record" >> ./lib/Songs.js
echo "]" >> ./lib/Songs.js
cd $SCRIPTDIR
