const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var ball_x_cor = 100;
var ball_y_cor = 100;
var ball_radius = 3;
var scr_width = canvas.width;
var scr_height = canvas.height;
var slab_lst = [];//[50,50] , [60,60]];
var free_fall = false; 



// choose random slab for ball to reside initially
generate_slab();
random_ball();

function generate_slab()
{
    for(var y = 30 ; y <= 120 ; y += 20)
    {
        var low_lim = 10;
        var upper_lim = 250;
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
    var ind = Math.floor(Math.random()*slab_lst.length);
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
            case 38:
                //down
                ball_y_cor-=2;
                draw_ball();
                break;
            case 39:
                //right
                ball_x_cor+=2;
                draw_ball();
                break;
            case 40:
                //up
                ball_y_cor+=2;
                draw_ball();
                break;
            }
        }
    }
);


function draw_ball()
{
    //console.log(ball_x_cor , ball_y_cor);
    if (check_col_ballslab() == false)
    {
        free_fall = true;
        set_gravity();
    }else{
        free_fall = false;

    }
    clear_canvas();
    draw_slab();
    ctx.beginPath();
    ctx.arc(ball_x_cor,ball_y_cor,ball_radius,0,Math.PI*2,false);
    ctx.fillStyle = 'orange';
    ctx.fill();
    ctx.closePath();
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

setInterval(()=>{
    for(var i = 0 ; i < slab_lst.length ; i ++)
    {
        slab_lst[i][1] -=1;
    }
    ball_y_cor -= 1;
    draw_ball();
} , 100)

// generate new row

setInterval(()=>{
    var low_lim = 10;
    var upper_lim = 250;
    var interval = 11;
    for(var i = low_lim ; i <= upper_lim ; i = i + interval )
    {
        var r = Math.floor(Math.random()*3) ; 
        if (r >= 2)
        {
            slab_lst.push([i,120]);
        }
    }
    draw_ball();
} , 2000)