window.onload = draw();
	
	function draw()
	{
        var c=document.getElementById("myCanvas");
        var ctx=c.getContext("2d");
        ctx.fillStyle="#FF0000";
        ctx.fillRect(0,0,1000,500);
        ctx.fillStyle="#000000";
        ctx.beginPath();
        ctx.moveTo(200, 300);
        ctx.lineTo(800, 300);
        ctx.lineTo(700,400);
        ctx.lineTo(300,400);
        ctx.fill();
        ctx.moveTo(600,300);
        ctx.lineTo(600,50);
        ctx.lineTo(350, 250);
        ctx.lineTo(700, 250);
        ctx.lineTo(600,50);
        ctx.stroke();
	  
        ctx.beginPath();
        ctx.fillStyle = '#FDB813';
        ctx.arc(250, 100, 50, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.closePath();
        
        
        
        
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