var fs = require("fs");
var inbox = require("inbox");
var simpleParser = require('mailparser').simpleParser;

var config = require("./.mail_config.json");

var client = inbox.createConnection(false, config.host, {
    secureConnection: true,
    auth:{
        user: config.user,
        pass: config.password
    }
});

client.connect();

client.on("connect", function(){
    client.openMailbox("INBOX", function(error, info){
        if(error) throw error;

        // only for development purposes
        /*
        client.listMessages(-10, function(err, messages) {
            messages.forEach(function(message){
                if(message.from.address == config.valid_sender && message.bodystructure['2'] !== undefined && message.bodystructure['2'].type === config.valid_content_type && message.bodystructure['2'].disposition[0].type === config.valid_type) {
                    simpleParser(client.createMessageStream(message.UID), (err, mail)=> {
                        fs.open(config.out_dir + message.UID + "_" + mail.attachments[0].filename, 'w', function(err, fd) {  
                            if (err) {
                                throw 'could not open file: ' + err;
                            }
                            fs.write(fd, mail.attachments[0].content, 0, mail.attachments[0].content.length, null, function(err) {
                                if (err) throw 'error writing file: ' + err;
                                fs.close(fd, function() {
                                    console.log('file wrote successfully: ' + config.out_dir + message.UID + "_" + mail.attachments[0].filename);
                                });
                            });
                        });
                    })
                }
            });
        });
        */
    });

    // on new messages, print to console
    client.on("new", function(message){
        if(/*message.from.address == config.valid_sender&&*/ message.bodystructure['2'] !== undefined && message.bodystructure['2'].type === config.valid_content_type && message.bodystructure['2'].disposition[0].type === config.valid_type) {
            simpleParser(client.createMessageStream(message.UID), (err, mail)=> {
                fs.open(config.out_dir + mail.attachments[0].filename, 'w', function(err, fd) {  
                    if (err) {
                        throw 'could not open file: ' + err;
                    }
                    fs.write(fd, mail.attachments[0].content, 0, mail.attachments[0].content.length, null, function(err) {
                        if (err) throw 'error writing file: ' + err;
                        fs.close(fd, function() {
                            console.log('file wrote successfully: ' + config.out_dir + message.UID + "_" + mail.attachments[0].filename);
                        });
                    });
                });
            })
        }
    });
});

client.on('error', function (err){
    console.log('Error');
    console.log(err)
});

client.on('close', function (){
    console.log('DISCONNECTED!');
});
