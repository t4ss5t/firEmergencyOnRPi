#!/bin/bash

DPI=300 # convert time on Raspberry Pi 2 (@1000 MHz clock, without x-server and VNC connection): DPI=300 ~ 33 seconds, DPI=200 ~ 22 seconds
OUTPUTFILEENDING=".tif"
LANGUAGE="deu"

inotifywait -mrq -e create --format %w%f $1 | while read FILE
do
	TIMESTAMP=$( date +%s )
	OUTPUTFILENAME=$TIMESTAMP$OUTPUTFILEENDING

    echo "New input-file named $FILE created at $TIMESTAMP"

	echo "convert $FILE to $2$OUTPUTFILENAME ..."

	nice -n -15 convert -density $DPI -depth 8 $FILE -fill white -draw 'rectangle 10,10 20,20' -background white -flatten +matte $2$OUTPUTFILENAME

	echo "convert done!"

	nice -n -15 tesseract $2$OUTPUTFILENAME $3$TIMESTAMP -l $LANGUAGE -psm 3

	echo "ocr done!"

	rm $2$OUTPUTFILENAME

	echo "file deleted"
done
