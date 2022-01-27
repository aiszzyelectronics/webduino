// Author: Chung-Yi Fu (Kaohsiung, Taiwan)   https://www.facebook.com/francefu

+(function (window, document) {

	'use strict';
	
	var robotfly_variable = {"roll":1500,"pitch":1500,"yaw":1500,"throttle":1500,"roll_calibration":0,"pitch_calibration":0,"yaw_calibration":0,"throttle_calibration":0,"constantheight_calibration":0,"takeoff":1800,"land":1400};
	
	function robotfly_initial(roll,pitch,yaw,throttle) {
	  robotfly_variable["roll"] = Math.floor(Number(roll))+robotfly_variable["roll_calibration"];   //左右roll: 1500+-500
	  robotfly_variable["pitch"] = Math.floor(Number(pitch))+robotfly_variable["pitch_calibration"];   //前後pitch: 1500+-500
	  robotfly_variable["yaw"] = Math.floor(Number(yaw))+robotfly_variable["yaw_calibration"];   //水平旋轉yaw: 1500+-500
	  robotfly_variable["throttle"] = Math.floor(Number(throttle))+robotfly_variable["throttle_calibration"];   //垂直升降throttle: 1000+-1000
	};

	function robotfly_command1(roll,pitch,yaw,throttle) {
	  robotfly_variable["roll_calibration"] = Math.floor(Number(roll));
	  robotfly_variable["pitch_calibration"] = Math.floor(Number(pitch));
	  robotfly_variable["yaw_calibration"] = Math.floor(Number(yaw));
	  robotfly_variable["throttle_calibration"] = Math.floor(Number(throttle));
	};

	function robotfly_command2(func) {
	  if (func =="unlock")
		return "'0x24,0x4d,0x3c,0x10,0xc8,0xdc,0x05,0xdc,0x05,0xd0,0x07,0xe8,0x03,0xdc,0x05,0xdc,0x05,0xdc,0x05,0xdc,0x05,0xe4'";
	  else if (func =="lock")
		return "'0x24,0x4d,0x3c,0x10,0xc8,0xdc,0x05,0xdc,0x05,0xe8,0x03,0xe8,0x03,0xdc,0x05,0xdc,0x05,0xdc,0x05,0xdc,0x05,0xd8'"
	  else if (func =="takeoff")
		return robotfly_command(robotfly_variable["roll"], robotfly_variable["pitch"], robotfly_variable["yaw"], robotfly_variable["takeoff"]);
	  else if (func =="land")
		return robotfly_command(robotfly_variable["roll"], robotfly_variable["pitch"], robotfly_variable["yaw"], robotfly_variable["land"]);
	  else	
		return "";
	};

	function robotfly_command3(func) {
	  if (func =="forward")
		return robotfly_command(robotfly_variable["roll"], robotfly_variable["pitch"]+100, robotfly_variable["yaw"], robotfly_variable["throttle"]);
	  else if (func =="backward")
		return robotfly_command(robotfly_variable["roll"], robotfly_variable["pitch"]-100, robotfly_variable["yaw"], robotfly_variable["throttle"]);
	  else if (func =="left")
		return robotfly_command(robotfly_variable["roll"]+100, robotfly_variable["pitch"], robotfly_variable["yaw"], robotfly_variable["throttle"]);
	  else if (func =="right")
		return robotfly_command(robotfly_variable["roll"]-100, robotfly_variable["pitch"], robotfly_variable["yaw"], robotfly_variable["throttle"]);
	  else if (func =="up")
		return 	robotfly_command(robotfly_variable["roll"], robotfly_variable["pitch"], robotfly_variable["yaw"], robotfly_variable["takeoff"]);
	  else if (func =="down")
		return 	robotfly_command(robotfly_variable["roll"], robotfly_variable["pitch"], robotfly_variable["yaw"], robotfly_variable["land"]);	
	  else if (func =="stop")
		return 	robotfly_command(robotfly_variable["roll"], robotfly_variable["pitch"], robotfly_variable["yaw"], robotfly_variable["throttle"]);
	  else	
		return "";
	};

	function robotfly_command(value_roll, value_pitch, value_yaw, value_throttle) {
	  var roll0=value_roll%256;
	  roll0="0x"+(roll0.toString(16).length==2?"":"0")+roll0.toString(16);
	  var roll1=Math.floor(value_roll/256);
	  roll1="0x"+(roll1.toString(16).length==2?"":"0")+roll1.toString(16);

	  var pitch0=value_pitch%256;
	  pitch0="0x"+(pitch0.toString(16).length==2?"":"0")+pitch0.toString(16);
	  var pitch1=Math.floor(value_pitch/256);
	  pitch1="0x"+(pitch1.toString(16).length==2?"":"0")+pitch1.toString(16);

	  var yaw0=value_yaw%256;
	  yaw0="0x"+(yaw0.toString(16).length==2?"":"0")+yaw0.toString(16);
	  var yaw1=Math.floor(value_yaw/256);
	  yaw1="0x"+(yaw1.toString(16).length==2?"":"0")+yaw1.toString(16);

	  var throttle0=value_throttle%256;
	  throttle0="0x"+(throttle0.toString(16).length==2?"":"0")+throttle0.toString(16);
	  var throttle1=Math.floor(value_throttle/256);
	  throttle1="0x"+(throttle1.toString(16).length==2?"":"0")+throttle1.toString(16);

	  var crc = 0x10^0xC8^roll0^roll1^pitch0^pitch1^yaw0^yaw1^throttle0^throttle1^0xDC^0x05^0xDC^0x05^0xDC^0x05^0xDC^0x05;
	  crc = "0x"+(crc.toString(16).length==2?"":"0")+crc.toString(16);

	  return "'0x24,0x4d,0x3c,0x10,0xc8,"+roll0+","+roll1+","+pitch0+","+pitch1+","+yaw0+","+yaw1+","+throttle0+","+throttle1+",0xdc,0x05,0xdc,0x05,0xdc,0x05,0xdc,0x05,"+crc+"'";
	}
	
    window.robotfly_initial = robotfly_initial;
    window.robotfly_command = robotfly_command;
    window.robotfly_command1 = robotfly_command1;
    window.robotfly_command2 = robotfly_command2;
    window.robotfly_command3 = robotfly_command3;	
	
}(window, window.document));