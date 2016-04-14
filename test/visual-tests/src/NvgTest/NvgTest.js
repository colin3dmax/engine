/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var NvgTestScene = TestScene.extend({
    ctor:function () {
        this._super(true);
        var size = cc.winSize;
        var nvgLayer = new NvgLayer();
        this.addChild(nvgLayer);
    },
    runThisTest:function () {
        cc.director.runScene(this);
    },
    MainMenuCallback:function (sender) {
        this._super(sender);
    }
});

var s_RADIUS=60;

function random(a,b){
    return Math.random()*(b-a)+a;
}

function random2Int(a,b){
    return Number.parseInt( random(a,b) );
}



function initialize(winSize){
    s_RADIUS =60;    
    
    nbPts = 150;
    angle = []
    rad = [];
    speed = [];
    x = [];
    y = [];
    diam = [];
    nbConnex = [];
    for (var i = 0; i<nbPts; i++) {
        angle[i] = random(0.0,Math.PI*2);
        rad[i] = random2Int(1, 5) * s_RADIUS;
        speed[i] = random(-.01, .01);
        x[i] = winSize.width/2;
        y[i] = winSize.height/2;
        nbConnex[i] = 0;
        diam[i] = 0;
    }
}

function mag(a,b){
    return Math.sqrt(a*a+b*b);
}

function dist(x1,y1,x2,y2){
    return mag(x2-x1,y2-y1);
}


var NvgLayer = cc.Layer.extend({
    _winSize:null,
    ctor:function () {
        var self = this;
        this._super();
        this._ballStartingVelocity = cc.p(20.0, -100.0);
        this._winSize = cc.director.getWinSize();

        var winSize = this._winSize;
        
        initialize(winSize);

        var node = _ccsg.NvgNode.create();

        node.drawDot(cc.p(30,30),200, cc.color(255,0,0,255) );

        node.drawRect(cc.p(120, 120), cc.p(200, 200), null, 2, cc.color(255, 0, 255, 255));

        node.drawFunc = function(transform, transformUpdated){
            var RADIUS = 22;
            //kmGLPushMatrix()
            //kmGLLoadMatrix(transform)
            
            node.beginFrame(self._winSize.width,self._winSize.height, 1);
            node.beginPath();
            node.rect(0,0, self._winSize.width,self._winSize.height);
            node.fillColor(cc.color(255,255,255,200));
            node.fill();

            //绘制球体之间的连接线
            node.strokeColor( cc.color(0,0,0,50));
            for (var i=0; i<nbPts-1; i++) {
                for (var j=i+1; j<nbPts; j++) {
                    if (dist(x[i], y[i], x[j], y[j])<RADIUS+10) {
                        node.beginPath();
                        node.moveTo(x[i], y[i]);
                        node.lineTo( x[j], y[j]);
                        node.stroke();
                        nbConnex[i]++;
                        nbConnex[j]++;
                    }
                }
            }


            //绘制圆圈
            for (var i=0; i<nbPts; i++) {
                angle[i] += speed[i];
                x[i] = node.ease(x[i], winSize.width/2 + Math.cos(angle[i]) * rad[i], 0.1);
                y[i] = node.ease(y[i], winSize.height/2 + Math.sin(angle[i]) * rad[i], 0.1);
                
                diam[i] = node.ease(diam[i], Math.min(nbConnex[i], 30)*Math.max(0.5,(rad[i]/RADIUS/5.0)), 0.1);
                
                node.beginPath();
                node.fillColor(cc.color(0,0,0,100));
                node.ellipse(x[i], y[i], diam[i] + 3, diam[i] + 3);
                node.fill();
                node.beginPath();
                node.fillColor(cc.color(0,0,0,255));
                node.ellipse(x[i], y[i], diam[i], diam[i]);
                node.fill();

                nbConnex[i] = 0;
            }


            node.beginPath();
            // node.moveTo(0,0);
            // node.lineTo(i, 40);
            // node.strokeColor(cc.color(255,0,0,255));
            // node.strokeWidth(3);
            // node.stroke();
            node.endFrame();


            //kmGLPopMatrix()
        }.bind(this);


        node.registerScriptDrawHandler(node.draw)

        this.addChild(node);

    },
});
