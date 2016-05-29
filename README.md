# firEmergencyOnRPi

Run firEmergency on a raspberry pi with fax input by a "Fritz Box" and fax processing with OCR engine tesseract.

## Install packages

```
$ sudo apt-get install imagemagick inotify-tools tightvncserver tesseract-ocr tesseract-ocr-deu tesseract-ocr-eng default-jre git htop python-pip
```

Ensure that you have enough space on the device (you should expand the file system before installing the packages).

## Install watchntouch

```
$ sudo pip install watchntouch
```

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
//192.168.XYZ.XYZ/NAME.nas /media/fritzbox cifs credentials=/home/pi/.smbcredentials,uid=1000,gid=1000,user 0 0
```

You can copy the smbcredentials-template from the repository to the pi-home folder and fiill out the parameters.

If the folder that is defined in fstab was not mounted after startup, you can automount with:

```
$ sudo mount -a
```

### Tightvnc

VNC allows remote maintenance. On first start, you have to assign passwords.

You can use the VNC server with "TightVNC Viewer" (Windows) or "xtightvncviewer" on Linux, example:

```
$ xtightvncviewer firemergency.fritz.box:1
```

Set up init.d services for vncserver (use file from repository):

```
$ sudo nano /etc/init.d/vncserver
$ sudo chmod +x /etc/init.d/vncserver
$ sudo update-rc.d vncserver defaults
$ sudo /etc/init.d/vncserver start
$ sudo /etc/init.d/vncserver stop
$ sudo /etc/init.d/vncserver restart
```

### Incoming fax observer

This is the script that registers incoming fax messages and convert it to tif pictures with imagemagick.

Run:

```
$ sh incomingfaxobserver.sh /media/fritzbox /home/pi/firEmergency1.9.9.6-Linux/files/fax/input/
```

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

Watch the directory "/home/pi/firEmergency1.9.9.6-Linux/files/fax/input/" for changes.

## Setup

You now have to setup firEmergency, take a look at the corresponding documentation for this issue.

Here are some tips for the use with mentioned components:

### Configure input plugin

Add "Leistellen Fax": Select "Tesseract" as OCR and set path (/usr/bin/tesseract).

### Message template / keywords

You can use the content of the following files to configure your alarm messages:

```
meldung_template.txt
meldung_zuordnung.txt
schluesselwoerter.txt
```

### Replacements

You can use the file "ersetzungen.txt" that is given in this repository, place your replacement in:

```
/home/pi/firemergency/firEmergency1.9.9.6-Linux/Config/ersetzungen.txt
```

## Usage

### Mount

Automount fritzbox directory (based on fstab configuration):

```
$ sudo mount -a
```

### firEmergency

Start instances with (open new terminal for each instance):

```
$ sh start.sh client
$ sh start.sh server
$ sh start.sh server-gui
```

Notice: You have to change to the firEmergency directory before calling the start script:
```
$ cd /home/pi/firemergency/firEmergency1.9.9.6-Linux
```

### Watchntouch

Run the watchntouch script (in an own terminal) to be sure that the inotify events are called:

```
$ watchntouch -w /media/fritzbox -l 10
```

Loglevel is set to 10, so you can see when watchntouch recognized a file.

### Incoming fax observer

Call the observer like it is mentioned above (in section: Run).
