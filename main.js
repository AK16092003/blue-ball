var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var lives = 3;
var ball_x_cor = 100;
var ball_y_cor = 100;
var ball_radius = 3;
var scr_width = canvas.width;
var scr_height = canvas.height;
var slab_lst = [];//[50,50] , [60,60]];
var free_fall = false; 
var health_pickup = [];
var score = 0;

// choose random slab for ball to reside initially
generate_slab();
random_ball();

function generate_slab()
{
    for(var y = 30 ; y <= 120 ; y += 20)
    {
        var low_lim = 10;
        var upper_lim = 290;
        var l = [];
        var interval = 11;
        for(var i = low_lim ; i <= upper_lim ; i = i + interval )
        {
            var r = Math.floor(Math.random()*3) ; 
            if (r >= 2)
            {
                slab_lst.push([i,y]);
            }
        }
    }
    console.log(slab_lst);
}

function random_ball()
{

    var ind = Math.floor(10+Math.random()*(slab_lst.length - 10));
    var x = slab_lst[ind][0];
    var y = slab_lst[ind][1];
    ball_x_cor = x+5;
    ball_y_cor = y-3;
    draw_ball();

}
document.addEventListener('keydown', function(e) {
    if (free_fall == false)
        {
        switch (e.keyCode) {
            case 37:
                //left
                ball_x_cor-=2;
                draw_ball();
                break;
            case 39:
                //right
                ball_x_cor+=2;
                draw_ball();
                break;
            }
        }
    }
);

function check_out()
{
    var y = ball_y_cor;
    if( y>=140 || y <= 10)
    {
        return true;
    }
    return false;
}
var flag = false;
function draw_ball()
{
    //console.log(ball_x_cor , ball_y_cor);
    if(check_out())
    {
        lives -= 1;
        if (lives <= 0 )
        {
            if(flag == false)
            {
                alert("game over!\nScore: "+score);
                var count = localStorage.getItem("count");
                if (count == null)
                {
                    count = 0;
                }           
                clearInterval(interval_1);
                clearInterval(interval_2); 
                clearInterval(interval_3); 
                var name = prompt("Enter your name: ");
                localStorage.setItem("Name"+count,name);
                localStorage.setItem("Score"+count,score);
                count = parseInt(count) + 1;
                localStorage.setItem("count" , count);
                window.location.href = "leaderboard.html";
                ball_x_cor = -100;
                ball_y_cor = -100;
                flag = true;
                return;
            }
        }
        else{
                alert("Be Carefull! , You have only "+lives+" lives left.");
                random_ball();
                return;
        }
    }
    if (check_col_ballslab() == false)
    {
        free_fall = true;
        set_gravity();
    }
    else{
        free_fall = false;
    }
    if (check_col_ballhealth() == true)
    {
        lives += 1;
    }

    clear_canvas();
    draw_lives();
    draw_spikes();
    draw_health_pickups();
    draw_slab();
    draw_health_pickups();
    ctx.beginPath();
    ctx.arc(ball_x_cor,ball_y_cor,ball_radius,0,Math.PI*2);
    ctx.fillStyle = 'blue';
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}
function draw_health_pickups()
{
    var n = health_pickup.length;
    var h_new = [];
    for(var i = 0 ; i < n ; i ++)
    {
        var x = health_pickup[i][0];
        var y = health_pickup[i][1];
        if (y >= 0)
        {
            h_new.push([x,y]);
            draw_heart(x,y,x+5,y+5,5,5,"blue");
        }
    }
    health_pickup = h_new;

    for(var i = 0 ; i < health_pickup.length; i ++)
    {
        var x = health_pickup[i][0];
        var y = health_pickup[i][1];
        draw_heart(x,y,x+5,y+5,5,5,"blue");
    }
}
function draw_lives()
{
    var x = 0;
    var y = 0;
    for(var i = 0 ; i < lives ; i ++ )
    {
        ctx.beginPath();
        draw_heart(10+i*20,15,15+i*20,20,5,5,"green");
    }
    ctx.closePath();
}

function draw_heart(fromx, fromy, tox, toy,lw,hlen,color) 
{
  // this snippet draw_heart(), i took reference from internet.

  var x = fromx;
  var y = fromy;
  var width = lw ;
  var height = hlen;

  ctx.save();
  ctx.beginPath();
  var topCurveHeight = height * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  // top left curve
  ctx.bezierCurveTo(
    x, y, 
    x - width / 2, y, 
    x - width / 2, y + topCurveHeight
  );

  // bottom left curve
  ctx.bezierCurveTo(
    x - width / 2, y + (height + topCurveHeight) / 2, 
    x, y + (height + topCurveHeight) / 2, 
    x, y + height
  );

  // bottom right curve
  ctx.bezierCurveTo(
    x, y + (height + topCurveHeight) / 2, 
    x + width / 2, y + (height + topCurveHeight) / 2, 
    x + width / 2, y + topCurveHeight
  );

  // top right curve
  ctx.bezierCurveTo(
    x + width / 2, y, 
    x, y, 
    x, y + topCurveHeight
  );

  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();

}

function set_gravity()
{
    setTimeout(()=>{
        ball_y_cor += 0.02;
        draw_ball();
    } , 1);
}
function check_col_ballslab()
{
    var n = slab_lst.length;
    for(var i = 0 ; i < n ; i ++)
    {
        var x = slab_lst[i][0];
        var y = slab_lst[i][1];
        var x1 = x-2;
        var x2 = x+12;
        var y1 = y-3;
        var y2 = y+2;
        if ((x1<=ball_x_cor && ball_x_cor<=x2) && (y1<=ball_y_cor && ball_y_cor<=y2))
        {
            console.log("clash - slab :"+(i+1));
            return true;
        }
    }
    return false;
}
function check_col_ballhealth()
{
    var n = health_pickup.length;
    for(var i = 0 ; i < n ; i ++)
    {
        var x = health_pickup[i][0];
        var y = health_pickup[i][1];
        var x1 = x-3;
        var x2 = x+3;
        var y1 = y-3;
        var y2 = y+3;
        if ((x1<=ball_x_cor && ball_x_cor<=x2) && (y1<=ball_y_cor && ball_y_cor<=y2))
        {
            console.log("clash - hp :"+(i+1));
            health_pickup.splice(i,1);
            return true;
        }
    }
    return false;
}
function draw_slab()
{
    var n = slab_lst.length;
    var slab_lst_new = [];
    for(var i = 0 ; i < n ; i ++)
    {

        var x = slab_lst[i][0];
        var y = slab_lst[i][1];
        if (y >= 0)
        {
            slab_lst_new.push([x,y]);       
            ctx.beginPath(x,y);
            ctx.fillStyle ="black";
            ctx.fillRect(x,y,10,1);
            ctx.closePath();
        }
    }
    slab_lst = slab_lst_new;
}

function clear_canvas()
{
    ctx.clearRect(0,0,scr_width , scr_height);
}

// all elements move upward

var interval_1 = setInterval(()=>{
    for(var i = 0 ; i < slab_lst.length ; i ++)
    {
        slab_lst[i][1] -=1;
    }for(var i = 0 ; i < health_pickup.length ; i ++)
    {
        health_pickup[i][1] -=1;
    }
    if (free_fall == false)
    ball_y_cor -= 1;
    draw_ball();
    score += 5;
} , 100);

// generate new row

var interval_2 = setInterval(()=>{
    var low_lim = 10;
    var upper_lim = 290;
    var interval = 11;
    if(slab_lst[slab_lst.length - 1][1] <= 90)
    {
        for(var i = low_lim ; i <= upper_lim ; i = i + interval )
        {
            var r = Math.floor(Math.random()*3); 
            if (r >= 2)
            {           
                slab_lst.push([i,120]);
            }
        }
    }

} , 100);

// generate health pickup
var interval_3 = setInterval(()=>{
    var ind = Math.floor(10+Math.random()*(slab_lst.length - 10));
    var x = slab_lst[ind][0];
    var y = slab_lst[ind][1];
    var h_x_cor = x+5;
    var h_y_cor = y-5;
    health_pickup.push([h_x_cor,h_y_cor]);

} , 10000);

// drawing spikes at top

function draw_spikes()
{
    ctx.beginPath();
    ctx.moveTo(0,0);
    for(var i = 1 ; i < 30 ; i +=2)
    { 
        ctx.lineTo(10*i,10);
        ctx.lineTo(10+10*i,0);
    }
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "orange";
    ctx.fillRect(0,140,300,10);
    ctx.closePath();
}