if (Meteor.isClient) {
  // counter starts at 0
  Session.set('ledState','OFF');

  Template.hello.helpers({
    state:function(){
     return Session.get('ledState');
    },
    coordinates:function(){
      return Session.get('Coor');
    }
  });


  Template.hello.events({
    'mousemove .surface':function(event) {
    var x = event.clientX;
    var y = event.clientY;
    var coor = "Coordinates: (" + x + "," + y + ")";

    Meteor.call('coordinates',x+","+y);
    Session.set('Coor',coor);
  },
    'click #onLed': function () {
      // increment the counter when button is clicked
      Meteor.call('send',"1",function(err,res){
            
              console.log(res);
              Session.set('ledState','ON');
          
      });
    },
    'click #offLed': function () {
      // increment the counter when button is clicked
      Meteor.call('send',"0",function(err,res){
          
              Session.set('ledState','OFF');
      
      });
    }
  });
}

if (Meteor.isServer) {

  var serialPort;

  Meteor.methods({
    'send': function(data){
      console.log("event fired");
       serialPort.write(data);
       serialPort.on('data', function(data) {
        
        console.log('message ' + data);
        
        });
    },
    'coordinates':function(coor){
     console.log(coor);
      serialPort.write(coor);
       serialPort.on('data', function(data) {
        
        console.log('message ' + data);
        
        });
    }
});

  /*Meteor.method({
    send:function(){
      var data = "1";
      // send data
      if(data){
        serialPort.on('open', function() {
        console.log('Port open');
           });
       //serialPort.write(data);

      // receive data
      serialPort.on('data', function(data) {
        console.log('message ' + data);
        });
      
      }
    });
  });*/



  Meteor.startup(function () {
    // code to run on server at startup

    // change the path and baudrate to match your setup
 serialPort = new SerialPort.SerialPort('COM4', {
    baudrate: 9600,
    parser: SerialPort.parsers.readline('\r\n')
});


  serialPort.on('open', function() {
        console.log('Port open');
           });



  });
}
