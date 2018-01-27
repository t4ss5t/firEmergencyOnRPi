# User Readme

## Service management

Check observers:

```
$ sudo systemctl status faxobserver.service
$ sudo systemctl status mailboxobserver.service
```

Check firEmergency services:

```
$ sudo systemctl status fireserver.service
$ sudo systemctl status fireclient.service
```

## Start Server GUI

Start Server GUI:

```
$ cd /home/pi/firemergency/firEmergency1.9.9.33-Linux
$ sh start.sh server-gui
```

## Mail Config

Mail Config is located at 

```
/home/pi/firemergency/firEmergencyOnRPi/mail_config.json 
```

## Fax Plugin

Fax Plugin is located at 

```
/home/pi/firemergency/firEmergency1.9.9.33-Linux/files/fax/input
```
