
function Clock(opt){

    $.extend(this,opt);

    this.ctx.font=this.fontSize+" "+this.fontFamily;
    this.ctx.textAlign="center";
    this.ctx.textBaseline="middle";

    this.init();
}
Clock.prototype={
    constructor:Clock,
    init:function(){
        var self=this;
        var ctx=self.ctx;
        this.timer=setInterval(function(){
            ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

            //绘制大圆
            self.drawBigCircle();
            //绘制刻度盘
            self.drawDial();
            //绘制指针
            self.drawPoints();
        },1000);



    },
    drawPoints:function(){
        //根据指定的时间绘制指针
        var date=new Date();

        var hour=date.getHours();//小时数：0-23之间
        var hour2=hour%12;//计算出0-11之间的值
        //发现0位于-PI/2
        //计算时针的弧度值
        //      a、计算相邻时针之间的弧度差
        //      b、弧度差*时间
        //      c、发现"0时"位于-PI/2的弧度，所以应该把上面的结果减去PI/2
        var hourRadian=2*Math.PI/12*hour2-Math.PI/2;
        //绘制指针
        this.drawPoint(40,hourRadian,"red",3);

        var minute=date.getMinutes();//分钟数：0-59
        var minuteRadian=2*Math.PI/60*minute-Math.PI/2;
        //绘制指针
        this.drawPoint(60,minuteRadian,"green",3);

        var second=date.getSeconds();//秒数：0-59
        var secondRadian=2*Math.PI/60*second-Math.PI/2;
        //绘制指针
        this.drawPoint(80,secondRadian,"blue",3);
    },

    drawBigCircle:function(){
        var ctx=this.ctx;

        ctx.save();
        ctx.strokeStyle="#335F9A";
        ctx.lineWidth=10;
        
        ctx.beginPath();
        ctx.arc(this.bigX,this.bigY,this.bigRadius,0,2*Math.PI);
        ctx.stroke();

        ctx.restore();
    },
    //绘制刻度盘
    drawDial:function(){

        var bigRadius=this.bigRadius-10/2;//减去大圆的线宽的一半

        var ctx=this.ctx;

        //第一个刻度线位于大圆的弧度值
        var start=-Math.PI/3;

        var radian=2*Math.PI/60;//相邻刻度线之间的弧度差

        for (var i = 0; i < 60; i++) {
            //计算出每一个刻度线的弧度值
            var smallRadian=start+radian*i;

            var length,lineWidth;//保存刻度线的线宽
            //有2种刻度，i被5整除是长刻度，其他都是短刻度
            if(i%5==0){
                length=this.bigLength;
                lineWidth=this.bigWidth;

                //指定文字与大圆圆心之间的距离
                this.drawText(i/5+1,smallRadian);

            }else{
                length=this.smallLength;
                lineWidth=this.smallWidth;
            }

            var h1=Math.sin(smallRadian)*(bigRadius-length);
            var b1=Math.cos(smallRadian)*(bigRadius-length);

            var h2=Math.sin(smallRadian)*bigRadius;
            var b2=Math.cos(smallRadian)*bigRadius;

            //刻度线起点坐标
            var x1=this.bigX+b1,y1=this.bigY+h1;
            //刻度线的终点坐标
            var x2=this.bigX+b2,y2=this.bigY+h2;

            ctx.save();
            ctx.lineWidth=lineWidth;

            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.stroke();

            ctx.restore();

            //刻度线的起始坐标和结束坐标的推导公式：
            // sin smallR=h1/(bigR-length)
            // -->h1=sin smallR*(bigR-length)
            // -->b1=cos smallR*(bigR-length)
            //
            // sin smallR=h2/bigR
            // -->h2=sin smallR*bigR;
            // -->b2=cos smallR*bigR;
            //
            // x1=bigX+b1,y1=bigY+h1
            // x2=bigX+b2,y2=bigY+h2;

        }
    },

    drawText:function(text,smallRadian){
        //指定文字与大圆圆心之间的距离
        var r=110;
        var b3=Math.cos(smallRadian)*r;
        var h3=Math.sin(smallRadian)*r;
        //计算文字的坐标
        var x3=this.bigX+b3,y3=this.bigY+h3;

        this.ctx.fillText(text,x3,y3);
    },

    /**
     *
     * @param length 指针的长度
     * @param radian 指针的终点位于大圆的弧度值
     */
    drawPoint:function(length,radian,color,width){
        var b=Math.cos(radian)*length;
        var h=Math.sin(radian)*length;

        //计算出指针终点的坐标
        var x=this.bigX+b,y=this.bigY+h;

        //绘制指针：
        var ctx=this.ctx;

        ctx.save();
        ctx.beginPath();

        ctx.moveTo(this.bigX,this.bigY);
        ctx.lineTo(x,y);
        ctx.strokeStyle=color;
        ctx.lineWidth=width;
        ctx.stroke();

        ctx.restore();
    }
}

