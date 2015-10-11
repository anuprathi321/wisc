window.onload = draw();
	var c;
	var ctx;
	var angle = 0;
	var boatAngle = 0;
	var dir = 1;
	
	function draw()
	{
		c=document.getElementById("myCanvas");
		ctx=c.getContext("2d");
		ctx.fillStyle="#FF0000";
		ctx.fillRect(0,0,1000,500);
		ctx.fillStyle="#000000";
		drawSun();
		drawWater();
		drawBoat();
		drawPropellor();
		window.requestAnimationFrame(draw);
	}
	
	function drawSun()
	{
		ctx.beginPath();
		ctx.fillStyle = '#FDB813';
		ctx.arc(250, 100, 50, 0, 2*Math.PI, false);
		ctx.fill();
		ctx.closePath();	
		
	}
	
	function drawPropellor()
	{
		angle += 5;

				ctx.translate(-250,-50);
				ctx.save();
									
					ctx.beginPath();
					ctx.moveTo(0,0);
					ctx.lineTo(0,-50);
					ctx.stroke();
					
					ctx.translate(0,-50);
					ctx.save();				

						ctx.rotate( angle*Math.PI/180);
						ctx.save();
						ctx.beginPath();
						ctx.moveTo(0,0);
						ctx.lineTo(25, 0);
						ctx.stroke();
						ctx.restore();
						
						ctx.restore();
						ctx.save();
						
						ctx.rotate((120+angle)*Math.PI/180);
						ctx.save();
							ctx.beginPath();
							ctx.moveTo(0,0);
							ctx.lineTo(25, 0);
							ctx.stroke();
						ctx.restore();
						
						ctx.restore();
						ctx.save();
						
						ctx.rotate((240 + angle)*Math.PI/180);
						ctx.save();
							ctx.beginPath();
							ctx.moveTo(0,0);
							ctx.lineTo(25, 0);
							ctx.stroke();
						ctx.restore();

					ctx.restore();	
					
				
				ctx.restore();
			ctx.restore();

	}
	
	function drawBoat()
	{
		ctx.fillStyle = '#000000';
        ctx.save();
			if(boatAngle > .2)
				dir = -1;
			if(boatAngle < -.2)
				dir = 1;
				
			boatAngle += dir*0.01;
			
			ctx.translate(500,350);
			ctx.rotate(boatAngle);
			ctx.save();
				ctx.beginPath();
				ctx.moveTo(-300, -50);
				ctx.lineTo(300,-50);
				ctx.lineTo(200,50);
				ctx.lineTo(-200,50);
				ctx.fill();
				ctx.moveTo(100,-50);
				ctx.lineTo(100,-300);
				ctx.lineTo(-150, -100);
				ctx.lineTo(200, -100);
				ctx.lineTo(100,-300);
				ctx.stroke();
			ctx.restore();
       
	}
	
	function drawWater()
	{

		var path = new Path2D();
        path.moveTo(0,350);
        
        path.quadraticCurveTo(100,350,150,325);
        path.quadraticCurveTo(200,350,250,325);
        path.quadraticCurveTo(300,350,350,325);
        path.quadraticCurveTo(400,350,450,325);
        path.quadraticCurveTo(500,350,550,325);
        path.quadraticCurveTo(600,350,650,325);
        path.quadraticCurveTo(700,350,750,325);
        path.quadraticCurveTo(800,350,850,325);
        path.quadraticCurveTo(900,350,950,325);
        path.quadraticCurveTo(1000,350,1050,325);
        
        path.moveTo(0,450);
            
        path.quadraticCurveTo(100,450,150,425);
        path.quadraticCurveTo(200,450,250,425);
        path.quadraticCurveTo(300,450,350,425);
        path.quadraticCurveTo(400,450,450,425);
        path.quadraticCurveTo(500,450,550,425);
        path.quadraticCurveTo(600,450,650,425);
        path.quadraticCurveTo(700,450,750,425);
        path.quadraticCurveTo(800,450,850,425);
        path.quadraticCurveTo(900,450,950,425);
        path.quadraticCurveTo(1000,450,1050,425);
        
        ctx.strokeStyle = '#40A4DF';
        ctx.stroke(path);
	}
