# firEmergencyOnRPi

Run firEmergency on a raspberry pi with fax input by a "Fritz Box" and fax processing with OCR engine tesseract.

## Install packages

```
$ sudo apt-get install imagemagick inotify-tools tightvncserver tesseract-ocr tesseract-ocr-deu tesseract-ocr-eng default-jre git htop
```

Ensure that you have enough space on the device (you should expand the file system before installing the packages).

## Get latest firEmergency edition for linux / set up workspace

Unzip file to destination folder (for example /home/pi/firemergency)

```
$ mkdir /home/pi/firemergency
$ mv /home/Downloads/firEmergency1.9.9.6-Linux.zip firemergency/
$ cd firemergency/
```

## Checkout git repo

```
$ cd ~
$ git clone https://github.com/t4ss5t/firEmergencyOnRPi.git
```

## Set Hostname

The hostname can be set by editing the hostname-file, you can set it to "firemergency" or leave it as it is.

```
$ sudo nano /etc/hostname
$ sudo /etc/init.d/hostname.sh
$ sudo reboot
```

On a fritz box, the full resulting network name is "firemergency.fritz.box".

## Mount fax folder

### Create folder

```
$ sudo mkdir /media/fritzbox
$ sudo chown pi fritzbox/
```

### Mount

You can mount the Fritz Box's fax folder in the fstab config-file:

```
$ sudo nano /etc/fstab
```

Add:

```
# fritz box fax
//fritz.box/klankenweg.nas /media/fritzbox cifs credentials=/home/pi/.smbcredentials,uid=1000,gid=1000,user 0 0
```

You can copy the smbcredentials-template from the repository to the pi-home folder and fiill out the parameters.

## Set up init.d services

```
$ sudo nano /etc/init.d/XXX
$ sudo chmod +x /etc/init.d/XXX
$ sudo update-rc.d XXX defaults
$ sudo /etc/init.d/XXX start
$ sudo /etc/init.d/XXX stop
$ sudo /etc/init.d/XXX restart
```

### Tightvnc

VNC allows remote maintenance. On first start, you have to assign passwords.

You can use the VNC server with "TightVNC Viewer" (Windows) or "xtightvncviewer" on Linux, example:

```
$ xtightvncviewer firemergency.fritz.box:1
```

### Incoming fax observer

This is the script that registers incoming fax messages and convert it to tif pictures with imagemagick.
After that, the picture is read by the tesseract ocr engine to get the text from the fax (as input for firEmergency).

Test:

```
$ cp /home/pi/firemergency/sample.pdf /media/fritzbox/
```

Or:

```
$ scp /home/user/file/sample.pdf pi@firemergency.fritz.box:/media/fritzbox/
```

Delete previous copied samples before with:

```
$ rm /media/fritzbox/sample.pdf
```

Watch the directory "/home/pi/firemergency/txt" for changes

### firEmergency

## Notices

### Transfer data to RPi

```
$ scp /home/user/file.zip pi@firemergency.fritz.box:/home/pi/firemergency 
```
