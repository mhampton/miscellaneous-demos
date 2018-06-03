// Modified by Marshall Hampton from a script by Jay Newby,
// http://bl.ocks.org/newby-jay/767c5ffdbbe43b65902f
// who in turn modified http://earth.nullschool.net/ by Cameron Beccario
var stage = new Konva.Stage({
    container: 'container',
    width: 200,
    height: 200
});
var layer = new Konva.Layer();
var rectX = 150;
var rectY = 150;
var ccirc = new Konva.Circle({
    x: rectX,
    y: rectY,
    radius: 7,
    fill: '#FFFFFF',
    draggable: true,
    name : 'control'
});
var xaxis = new Konva.Line({
    points: [0,100,200,100],
    stroke: 'white'
});
var yaxis = new Konva.Line({
    points: [100,0,100,200],
    stroke: 'white'
});
dlinepts = [];
for(i=0;i<201;i++){
    dlinepts.push(i);
    dlinepts.push(100-(i-100)**2/4.0/33.0);
}
var dettrline = new Konva.Line({
    points: dlinepts,
    stroke: 'white'
});

layer.add(dettrline);
layer.add(xaxis);
layer.add(yaxis);
layer.add(ccirc);
stage.add(layer);

(function animation() {
    var dt = 0.005,
    X0 = [], Y0 = [],
    X = [], Y = [],
    xb = 5, yb =5;
    var N = 50,
    xp = d3.range(N).map(
        function (i) {
            return xb*(-1 + i*2/N);
        }),
        yp = d3.range(N).map(
            function (i) {
                return yb*(-1 + i*2/N);
            });
            for (var i = 0; i < N; i++) {
                for (var j = 0; j < N; j++) {
                    X.push(xp[j]), Y.push(yp[i]);
                    X0.push(xp[j]), Y0.push(yp[i]);
                }
            }
            nx = 75;
            ny = 0;
            cos = Math.cos;
            sin = Math.sin;
            function F(x, y, ax,ay) {
                var tq = -ay+ax*ax/4;
                r = Math.sqrt(Math.abs(tq));
                if (tq>0){
                    r2= r;
                }
                else{
                    r2 = -r;
                }

                return [ax/2*x+r*y,r2*x + ax/2*y]
            }
            var cnvs = document.getElementById("animation"),
            width = cnvs.width,
            height = cnvs.height,
            mw = 0,
            g = d3.select("#animation").node().getContext("2d");
            g.fillStyle = "rgba(0, 0, 0, 0.04)";
            g.lineWidth = 0.7;
            g.strokeStyle = "#ccffcc";
            var xMap = d3.scale.linear()
            .domain([-xb, xb])
            .range([mw, width - mw]),
            yMap = d3.scale.linear()
            .domain([-yb, yb])
            .range([height - mw, mw]);
            var animAge = 0,
            frameRate = 100,
            M = X.length,
            MaxAge = 100,
            age = [];
            for (var i=0; i<M; i++) {age.push(randage());}
            var drawFlag = true;
            d3.timer(function () {if (drawFlag) {draw();}}, frameRate);
            d3.select("#animation")
            .on("click", function() {drawFlag = (drawFlag) ? false : true;})
            function randage() {
                return Math.round(Math.random()*100);
            }
            g.globalCompositeOperation = "source-over";
            function draw() {
                cc = stage.find('.control')[0];
                nx = (cc.x()-100)/33.0;
                ny = -(cc.y()-100)/33.0;
                g.fillRect(0, 0, width, height);
                for (var i=0; i<M; i++) {
                    var dr = F(X[i], Y[i], nx, ny);
                    g.beginPath();
                    g.moveTo(xMap(X[i]), yMap(Y[i]));
                    g.lineTo(xMap(X[i]+=dr[0]*dt), yMap(Y[i]+=dr[1]*dt));
                    g.stroke();
                    if (age[i]++ > MaxAge) {
                        age[i] = randage();
                        X[i] = X0[i], Y[i] = Y0[i];
                    }
                }
            }
        })()
