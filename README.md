# firEmergencyOnRPi

Run firEmergency on a Raspberry Pi with fax input by a "Fritz Box" and fax processing with OCR engine tesseract.

## Install packages

```
$ sudo apt-get install imagemagick inotify-tools tightvncserver tesseract-ocr tesseract-ocr-deu tesseract-ocr-eng default-jre git htop python-pip nodejs npm
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

## Configure services

### Tightvnc

VNC allows remote maintenance. On first start, you have to assign passwords.

You can use the VNC server with "TightVNC Viewer" (Windows) or "xtightvncviewer" on Linux, example (Port: 1):

```
$ xtightvncviewer firemergency.fritz.box:1
```

Set up init.d services for vncserver (use file from repository):

Install and enable:

```
$ sudo cp vncserver.service /lib/systemd/system/vncserver.service
$ sudo systemctl enable vncserver.service
```

Use:

```
$ sudo systemctl start vncserver.service
$ sudo systemctl stop vncserver.service
$ sudo systemctl restart vncserver.service
$ sudo systemctl status vncserver.service
```

Disable:

```
$ sudo systemctl disable vncserver.service
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

### Setup fireserver service

Install and enable:

```
$ sudo cp fireserver.service /lib/systemd/system/fireserver.service
$ sudo systemctl enable fireserver.service
```

Use:

```
$ sudo systemctl start fireserver.service
$ sudo systemctl stop fireserver.service
$ sudo systemctl restart fireserver.service
$ sudo systemctl status fireserver.service
```

Disable:

```
$ sudo systemctl disable fireserver.service
```

### Setup fireclient service


Install and enable:

```
$ sudo cp fireclient.service /lib/systemd/system/fireclient.service
$ sudo systemctl enable fireclient.service
```

Use:

```
$ sudo systemctl start fireclient.service
$ sudo systemctl stop fireclient.service
$ sudo systemctl restart fireclient.service
$ sudo systemctl status fireclient.service
```

Disable:

```
$ sudo systemctl disable fireclient.service
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

#### Setup faxobserver service

Install and enable:

```
$ sudo cp faxobserver.service /lib/systemd/system/faxobserver.service
$ sudo systemctl enable faxobserver.service
```

Use:

```
$ sudo systemctl start faxobserver.service
$ sudo systemctl stop faxobserver.service
$ sudo systemctl restart faxobserver.service
$ sudo systemctl status faxobserver.service
```

Disable:

```
$ sudo systemctl disable faxobserver.service
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

### Setup mailboxobserver service

Install and enable:

```
$ sudo cp mailboxobserver.service /lib/systemd/system/mailboxobserver.service
$ sudo systemctl enable mailboxobserver.service
```

Use:

```
$ sudo systemctl start mailboxobserver.service
$ sudo systemctl stop mailboxobserver.service
$ sudo systemctl restart mailboxobserver.service
$ sudo systemctl status mailboxobserver.service
```

Disable:

```
$ sudo systemctl disable mailboxobserver.service
```

## Cronjobs

Edit root's crontab to be sure services are started as root:

```
sudo crontab -e
```

Restart the observer services every hour:

```
*/15 * * * *  systemctl restart mailboxobserver.service > /dev/null 2>&1
*/15 * * * *  systemctl restart faxobserver.service > /dev/null 2>&1
#-----------------------------------------------------------------
```
