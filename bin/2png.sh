#!/bin/sh
#
# convert form .chordpro to .png
#

echo "creating $1.png ..."
chordii -P "a4" -G -a -o $1.ps $1
convert -density 120 $1.ps $1.ps-%01d.png
mogrify -background white -flatten $1.ps-*.png
rm -f $1.ps


