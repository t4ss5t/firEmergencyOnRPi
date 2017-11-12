# firEmergencyOnRPi

Run firEmergency on a Raspberry Pi with fax input by a "Fritz Box" and fax processing with OCR engine tesseract.

## Install packages

```
$ sudo apt-get install imagemagick inotify-tools tightvncserver tesseract-ocr tesseract-ocr-deu tesseract-ocr-eng default-jre git htop python-pip
```

Ensure that you have enough space on the device (you should expand the file system before installing the packages).

## Get latest firEmergency edition for linux / set up workspace

Unzip file to destination folder (for example /home/pi/firemergency)

```
$ mkdir /home/pi/firemergency
$ mv /home/Downloads/firEmergencyA.B.C.D-Linux.zip firemergency/
$ cd firemergency/
$ unzip firEmergencyA.B.C.D-Linux.zip
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

### Tightvnc

VNC allows remote maintenance. On first start, you have to assign passwords.

You can use the VNC server with "TightVNC Viewer" (Windows) or "xtightvncviewer" on Linux, example (Port: 1):

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

This is the script that registers incoming fax messages (PDF) and convert it to TIF pictures with imagemagick.

Run:

```
$ sh incomingfaxobserver.sh /home/pi/firemergency/mail_input /home/pi/firEmergencyA.B.C.D-Linux/files/fax/input/
```

Test (be sure that you have a "sample.pdf" in the current directory):

```
$ cp sample.pdf /home/pi/firemergency/mail_input
```

Or:

```
$ scp /home/user/file/sample.pdf pi@firemergency.fritz.box:/home/pi/firemergency/mail_input
```

Delete previous copied samples before with:

```
$ rm /home/pi/firemergency/mail_inputsample.pdf
```

Watch the directory "/home/pi/firEmergencyA.B.C.D-Linux/files/fax/input/" for changes.

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
/home/pi/firemergency/firEmergencyA.B.C.D-Linux/Config/ersetzungen.txt
```

## Usage

### firEmergency

Start instances with (open new terminal for each instance):

```
$ sh start.sh client
$ sh start.sh server
$ sh start.sh server-gui
```

Notice: You have to change to the firEmergency directory before calling the start script:
```
$ cd /home/pi/firemergency/firEmergencyA.B.C.D-Linux
```

### Incoming fax observer

Call the observer like it is mentioned above (in section: Run).

#### Service Setup

```
$ sudo cp faxobserver /etc/init.d/faxobserver
$ sudo chmod +x /etc/init.d/faxobserver
$ sudo update-rc.d faxobserver defaults
$ sudo /etc/init.d/faxobserver start
$ sudo /etc/init.d/faxobserver stop
$ sudo /etc/init.d/faxobserver restart
```

## Node.js Script

### Setup

Install modules from packages.json (perhaps as root):

```
$ npm install
```

### Configure

Edit mail config file
1. Copy the template file 'mail_config.js' to '.mail_config.js'
2. Edit mail config file

### Run

Run in Terminal (with repository as current folder)
```
$ npm run observemailbox
```
### Service Setup

```
$ sudo cp mailboxobserver /etc/init.d/mailboxobserver
$ sudo chmod +x /etc/init.d/mailboxobserver
$ sudo update-rc.d mailboxobserver defaults
$ sudo /etc/init.d/mailboxobserver start
$ sudo /etc/init.d/mailboxobserver stop
$ sudo /etc/init.d/mailboxobserver restart
```
