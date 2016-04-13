/****************************************************************************
 Copyright (c) 2016 Colin3dmax
 http://www.cross2d.com
 ****************************************************************************/



cc.v2fzero = function () {
    return {x: 0, y: 0};
};

cc.v2f = function (x, y) {
    return {x: x, y: y};
};

cc.v2fadd = function (v0, v1) {
    return cc.v2f(v0.x + v1.x, v0.y + v1.y);
};

cc.v2fsub = function (v0, v1) {
    return cc.v2f(v0.x - v1.x, v0.y - v1.y);
};

cc.v2fmult = function (v, s) {
    return cc.v2f(v.x * s, v.y * s);
};

cc.v2fperp = function (p0) {
    return cc.v2f(-p0.y, p0.x);
};

cc.v2fneg = function (p0) {
    return cc.v2f(-p0.x, -p0.y);
};

cc.v2fdot = function (p0, p1) {
    return  p0.x * p1.x + p0.y * p1.y;
};

cc.v2fforangle = function (_a_) {
    return cc.v2f(Math.cos(_a_), Math.sin(_a_));
};

cc.v2fnormalize = function (p) {
    var r = cc.pNormalize(cc.p(p.x, p.y));
    return cc.v2f(r.x, r.y);
};

cc.__v2f = function (v) {
    return cc.v2f(v.x, v.y);
};

cc.__t = function (v) {
    return {u: v.x, v: v.y};
};


/**
 * <p>CCNvgNode                                                <br/>
 * Node that draws dots, segments and polygons.                        <br/>
 * Faster than the "drawing primitives" since they it draws everything in one single batch.</p>
 * @class
 * @name _ccsg.NvgNode
 * @extends  _ccsg.Node
 */
_ccsg.NvgNode = _ccsg.Node.extend(/** @lends _ccsg.NvgNode# */{
//TODO need refactor
    _name:"ccsg.NvgNode",
    _className: "NvgNode",
    _buffer:null,
    _blendFunc:null,
    _lineWidth: 1,
    _drawColor: null,
    _displayedOpacity:255,
    NVG_KAPPA90:0.5522847493,
    NVG_BUTT:0,
    NVG_ROUND:1,
    NVG_SQUARE:2,
    NVG_BEVEL:3,
    NVG_MITER:4,

    NVG_ALIGN_LEFT:1<<0,
    NVG_ALIGN_CENTER:1<<1,
    NVG_ALIGN_RIGHT:1<<2,
    NVG_ALIGN_TOP:1<<3,
    NVG_ALIGN_MIDDLE:1<<4,
    NVG_ALIGN_BOTTOM:1<<5,
    NVG_ALIGN_BASELINE:1<<6,

    NVG_IMAGE_GENERATE_MIPMAPS:1<<0,
    NVG_IMAGE_REPEATX:1<<1,
    NVG_IMAGE_REPEATY:1<<2,
    NVG_IMAGE_FLIPY:1<<3,
    NVG_IMAGE_PREMULTIPLIED:1<<4,


    //fontHandle it is a system font name, ttf file path or bmfont file path.
    ctor: function() {
        _ccsg.Node.prototype.ctor.call(this);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        _ccsg.Node.prototype.setContentSize.call(this, cc.size(128, 128));
        this._blendFunc = cc.BlendFunc._alphaNonPremultiplied();
    },

    /**
     * Gets the blend func
     * @returns {Object}
     */
    getBlendFunc: function () {
        return this._blendFunc;
    },

    /**
     * Set the blend func
     * @param blendFunc
     * @param dst
     */
    setBlendFunc: function (blendFunc, dst) {
        if (dst === undefined) {
            this._blendFunc.src = blendFunc.src;
            this._blendFunc.dst = blendFunc.dst;
        } else {
            this._blendFunc.src = blendFunc;
            this._blendFunc.dst = dst;
        }
    },

    /**
     * line width setter
     * @param {Number} width
     */
    setLineWidth: function (width) {
        this._lineWidth = width;
    },

    /**
     * line width getter
     * @returns {Number}
     */
    getLineWidth: function () {
        return this._lineWidth;
    },

    /**
     * draw color setter
     * @param {cc.Color} color
     */
    setDrawColor: function (color) {
        var locDrawColor = this._drawColor;
        locDrawColor.r = color.r;
        locDrawColor.g = color.g;
        locDrawColor.b = color.b;
        locDrawColor.a = (color.a == null) ? 255 : color.a;
    },

    /**
     * draw color getter
     * @returns {cc.Color}
     */
    getDrawColor: function () {
        return  cc.color(this._drawColor.r, this._drawColor.g, this._drawColor.b, this._drawColor.a);
    },
    /**
     * draw register by Colin3dmax
    */
    registerScriptDrawHandler:function(drawFunc){
        this.drawHandler = drawFunc;
    },

    ease:function(variable, target, easingVal){
        var d = target - variable;
        if (Math.abs(d)>1) variable+= d*easingVal;
        return variable;
    },
    save:function(){
         var ctx = this.wrapper.getContext();
         ctx.save();
    },
    restore:function(){
         var ctx = this.wrapper.getContext();
         ctx.restore();
    },
    reset:function(){
         var ctx = this.wrapper.getContext();
         this.strokeWidth(1.0);
         this.miterLimit(10.0);
         this.lineCap(this.NVG_BUTT);
         this.lineJoin(this.NVG_MITER)
         this.globalAlpha(1.0);
         this.resetTransform();
         // this.resetScissor();
         this.fontSize(16.0);
         this.textLetterSpacing(0.0);
         this.textLineHight(1.0);
         this.fontBlur(0.0);
         this.textAlign = this.NVG_ALIGN_LEFT | this.NVG_ALIGN_BASELINE;
         this.fontFaceId(0);

    },
    miterLimit:function(limit){
        var ctx = this.wrapper.getContext();
        ctx.miterLimit=limit;
    },
    strokeWidth:function(size){
        var ctx = this.wrapper.getContext();
        ctx.lineWidth = size;
    },
    lineCap:function(cap){
        var ctx = this.wrapper.getContext();
        ctx.lineCap = cap;
    },
    lineJoin:function(join){
        var ctx = this.wrapper.getContext();
        ctx.lineJoin = join;
    },
    globalAlpha:function(alpha){
        // var ctx = this.wrapper.getContext();
        this.wrapper.setGlobalAlpha(alpha);
    },
    resetTransform:function(){
        var ctx = this.wrapper.getContext();
        ctx.setTransform(1.0,0.0,0.0,1.0,0.0,0.0);
    },
    translate:function(x,y){
        var ctx = this.wrapper.getContext();
        ctx.translate(x,y);
    },
    rotate:function(angle){
        var ctx = this.wrapper.getContext();
        ctx.rotate(angle);
    },
    skewX:function(angle){
        var ctx = this.wrapper.getContext();
        console.log("skewX unimpl");
    },
    skewY:function(angle){
        var ctx = this.wrapper.getContext();
        console.log("skewY unimpl");
    },
    scale:function(x,y){
        var ctx = this.wrapper.getContext();
        ctx.scale(x,y)
    },
    currentTransform:function(xform){
        var ctx = this.wrapper.getContext();
        ctx.setTransform(xform[0],xform[1],xform[2],xform[3],xform[4],xform[5]);
    },
    transformIdentity:function(xform){
        var ctx = this.wrapper.getContext();
        ctx.setTransform(1.0,0.0,0.0,1.0,0.0,0.0);
    },
    degToRad:function(deg){
        return deg / 180.0 * Math.PI;
    },
    radToDeg:function(rad){
        return rad /  Math.PI * 180.0;
    },
    strokeColor:function(color){
        var ctx = this.wrapper.getContext();
        ctx.strokeColor="rgba("+color.r+","+color.g+","+color.b+","+color.a+")";
    },
    strokePaint:function(){
        console.log("strokePaint unimpl");
    },


    fillColor:function(color){
        var ctx = this.wrapper.getContext();
        ctx.fillStyle="rgba("+color.r+","+color.g+","+color.b+","+color.a/255+")";
    },

    fillPaint:function(){
        console.log("fillPaint unimpl");
    },
    createImage:function(filname,imageFlags){
        console.log("createImage unimpl");
    },
    createImageMem:function(){
        console.log("createImageMem unimpl");  
    },
    createImageRGBA:function(){
        console.log("createImageRGBA unimpl");  
    },
    updateImage:function(){
        console.log("updateImage unimpl");    
    },
    imageSize:function(){
        console.log("imageSize unimpl"); 
    },
    deleteImage:function(){
        console.log("deleteImage unimpl");   
    },
    linearGradient:function(){
        console.log("linearGradient unimpl");     
    },
    radialGradient:function(){
        console.log("radialGradient unimpl");
    },
    boxGradient:function(){
        console.log("boxGradient unimpl");  
    },
    imagePattern:function(){
        console.log("imagePattern unimpl");
    },
    scissor:function(){
        console.log("scissor unimpl");
    },
    intersectScissor:function(){
        console.log("intersectScissor unimpl");
    },
    resetScissor:function(){
        console.log("resetScissor unimpl");
    },

    beginFrame:function(windowWidth,windowHeight,devicePixelRatio){
        var winSize = cc.director.getWinSize();
        // console.log("beginFrame");
        this.save();
        this.reset();
        // var t={
        //     a:1/windowWidth,
        //     b:0,
        //     c:0,
        //     d:1/windowHeight,
        //     tx:0,
        //     ty:0,
        // }

        var ctx = this.wrapper.getContext();
        ctx.transform(windowWidth/winSize.width,0,0,windowHeight/winSize.height,0,0);


        // ctx.transform(1,0,0,1,0,0);
        // ctx.fillStyle='#FF0000';
        // ctx.fillRect(0,0,80,100);
        

    },
    endFrame:function(){
        // console.log("endFrame")
        this.restore();
    },
    beginPath:function(){
        var ctx = this.wrapper.getContext();
        ctx.beginPath();
    },

    moveTo:function(x,y){
        var ctx = this.wrapper.getContext();
        ctx.moveTo(x,y);
    },

    lineTo:function(x,y){
        var ctx = this.wrapper.getContext();
        ctx.lineTo(x,y);
    },
    bezierTo:function(c1x,c1y,c2x,c2y,x,y){
        var ctx = this.wrapper.getContext();
        ctx.bezierCurveTo(c1x,c1y,c2x,c2y,x,y);
    },
    quadTo:function(cx,cy,x,y){
        var ctx = this.wrapper.getContext();
        ctx.quadraticCurveTo(cx,cy,x,y);
    },
    arcTo:function(x1,y1,x2,y2,radius){
        var ctx = this.wrapper.getContext();
        ctx.arcTo(x1,y1,x2,y2,radius);
    },
    closePath:function(){
        var ctx = this.wrapper.getContext();
        ctx.closePath();
    },
    pathWinding:function(){
        var ctx = this.wrapper.getContext();
        console.log("pathWinding unimpl");
    },
    arc:function(cx,cy,r,a0,a1,dir){
        var ctx = this.wrapper.getContext();
        ctx.arc(cx,cy,r,a0,a1,dir);
    },
    rect:function(x,y,w,h){
        var ctx = this.wrapper.getContext();
        ctx.rect(x,y,w,h);
    },
    roundedRect:function(x,y,w,h,r){
        var ctx = this.wrapper.getContext();
        if(r<0.1){
            this.rect(ctx, x,y,w,h);
        }else{
            var ctx = this.wrapper.getContext();
            var NVG_KAPPA90 = this.NVG_KAPPA90;
            var rx = Math.min(r, Math.abs(w)*0.5) * Math.sign(w);
            var ry = Math.min(r, Math.abs(h)*0.5) * Math.sign(h);
            this.moveTo(x,y+ry);
            this.lineTo(x, y+h-ry);
            this.bezierTo(x, y+h-ry*(1-NVG_KAPPA90), x+rx*(1-NVG_KAPPA90), y+h, x+rx, y+h );
            this.lineTo( x+w-rx, y+h );
            this.bezierTo( x+w-rx*(1-NVG_KAPPA90), y+h, x+w, y+h-ry*(1-NVG_KAPPA90), x+w, y+h-ry );
            this.lineTo( x+w, y+ry );
            this.bezierTo( x+w, y+ry*(1-NVG_KAPPA90), x+w-rx*(1-NVG_KAPPA90), y, x+w-rx, y );
            this.lineTo( x+rx, y );
            this.bezierTo( x+rx*(1-NVG_KAPPA90), y, x, y+ry*(1-NVG_KAPPA90), x, y+ry );

        }
    },
    ellipse:function(cx,cy,rx,ry){
        var ctx = this.wrapper.getContext();
        var NVG_KAPPA90 = this.NVG_KAPPA90;
        this.moveTo(cx-rx,cy);
        this.bezierTo( cx-rx, cy+ry*NVG_KAPPA90, cx-rx*NVG_KAPPA90, cy+ry, cx, cy+ry );
        this.bezierTo( cx+rx*NVG_KAPPA90, cy+ry, cx+rx, cy+ry*NVG_KAPPA90, cx+rx, cy );
        this.bezierTo( cx+rx, cy-ry*NVG_KAPPA90, cx+rx*NVG_KAPPA90, cy-ry, cx, cy-ry );
        this.bezierTo( cx-rx*NVG_KAPPA90, cy-ry, cx-rx, cy-ry*NVG_KAPPA90, cx-rx, cy );
    },
    circle:function(cx,cy,r){
        var ctx = this.wrapper.getContext();
        this.ellipse(cx,cy,r,r)
    },
    fill:function(){
        var ctx = this.wrapper.getContext();
        ctx.fill();
    },
    stroke:function(){
        var ctx = this.wrapper.getContext();
        ctx.stroke();
    },

    createFont:function(name,filename){
        console.log("createFont unimpl");
    },
    createFontMem:function(){
        console.log("createFontMem unimpl");
    },
    findFont:function(){
        console.log("findFont unimpl");
    },
    fontSize:function(){

    },
    fontBlur:function(){

    },
    textLetterSpacing:function(){

    },
    textLineHight:function(){

    },
    textAlign:function(){

    },
    fontFaceId:function(){

    },
    text:function(){

    },
    textBox:function(){

    },
    textBounds:function(){

    },
    textBoxBounds:function(){

    },
    textGlyphPositions:function(){

    },
    textMetrics:function(){

    },
    textBreakLines:function(){

    },


});

/**
 * Creates a NvgNode
 * @deprecated since v3.0 please use new _ccsg.NvgNode() instead.
 * @return {_ccsg.NvgNode}
 */
_ccsg.NvgNode.create = function () {
    return new _ccsg.NvgNode();
};


_ccsg.NvgNode.TYPE_DOT = 0;
_ccsg.NvgNode.TYPE_SEGMENT = 1;
_ccsg.NvgNode.TYPE_POLY = 2;

cc.game.once(cc.game.EVENT_RENDERER_INITED, function () {
    if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {

        cc._NvgNodeElement = function (type, verts, fillColor, lineWidth, lineColor, lineCap, isClosePolygon, isFill, isStroke) {
            var _t = this;
            _t.type = type;
            _t.verts = verts || null;
            _t.fillColor = fillColor || null;
            _t.lineWidth = lineWidth || 0;
            _t.lineColor = lineColor || null;
            _t.lineCap = lineCap || "butt";
            _t.isClosePolygon = isClosePolygon || false;
            _t.isFill = isFill || false;
            _t.isStroke = isStroke || false;
        };

        cc.js.mixin(_ccsg.NvgNode.prototype, /** @lends _ccsg.NvgNode# */{
            _className:"NvgNodeCanvas",

            /**
             * <p>The _ccsg.NvgNodeCanvas's constructor. <br/>
             * This function will automatically be invoked when you create a node using new construction: "var node = new _ccsg.NvgNodeCanvas()".<br/>
             * Override it to extend its behavior, remember to call "this._super()" in the extended "ctor" function.</p>
             */
            ctor: function () {
                 _ccsg.Node.prototype.ctor.call(this);
                var locCmd = this._renderCmd;
                locCmd._buffer = this._buffer = [];
                locCmd._drawColor = this._drawColor = cc.color(255, 255, 255, 255);
                locCmd._blendFunc = this._blendFunc = new cc.BlendFunc(cc.SRC_ALPHA, cc.ONE_MINUS_SRC_ALPHA);

                this.init();
            },

            /**
             * draws a rectangle given the origin and destination point measured in points.
             * @param {cc.Point} origin
             * @param {cc.Point} destination
             * @param {cc.Color} fillColor
             * @param {Number} lineWidth
             * @param {cc.Color} lineColor
             */
            drawRect: function (origin, destination, fillColor, lineWidth, lineColor) {
                lineWidth = (lineWidth == null) ? this._lineWidth : lineWidth;
                lineColor = lineColor || this.getDrawColor();
                if(lineColor.a == null)
                    lineColor.a = 255;

                var vertices = [
                    origin,
                    cc.p(destination.x, origin.y),
                    destination,
                    cc.p(origin.x, destination.y)
                ];
                var element = new cc._NvgNodeElement(_ccsg.NvgNode.TYPE_POLY);
                element.verts = vertices;
                element.lineWidth = lineWidth;
                element.lineColor = lineColor;
                element.isClosePolygon = true;
                element.isStroke = true;
                element.lineCap = "butt";
                element.fillColor = fillColor;
                if (fillColor) {
                    if(fillColor.a == null)
                        fillColor.a = 255;
                    element.isFill = true;
                }
                this._buffer.push(element);
            },

            /**
             * draws a circle given the center, radius and number of segments.
             * @override
             * @param {cc.Point} center center of circle
             * @param {Number} radius
             * @param {Number} angle angle in radians
             * @param {Number} segments
             * @param {Boolean} drawLineToCenter
             * @param {Number} lineWidth
             * @param {cc.Color} color
             */
            drawCircle: function (center, radius, angle, segments, drawLineToCenter, lineWidth, color) {
                lineWidth = lineWidth || this._lineWidth;
                color = color || this.getDrawColor();
                if (color.a == null)
                    color.a = 255;

                var coef = 2.0 * Math.PI / segments;
                var vertices = [];
                for (var i = 0; i <= segments; i++) {
                    var rads = i * coef;
                    var j = radius * Math.cos(rads + angle) + center.x;
                    var k = radius * Math.sin(rads + angle) + center.y;
                    vertices.push(cc.p(j, k));
                }
                if (drawLineToCenter) {
                    vertices.push(cc.p(center.x, center.y));
                }

                var element = new cc._NvgNodeElement(_ccsg.NvgNode.TYPE_POLY);
                element.verts = vertices;
                element.lineWidth = lineWidth;
                element.lineColor = color;
                element.isClosePolygon = true;
                element.isStroke = true;
                this._buffer.push(element);
            },

            /**
             * draws a quad bezier path
             * @override
             * @param {cc.Point} origin
             * @param {cc.Point} control
             * @param {cc.Point} destination
             * @param {Number} segments
             * @param {Number} lineWidth
             * @param {cc.Color} color
             */
            drawQuadBezier: function (origin, control, destination, segments, lineWidth, color) {
                lineWidth = lineWidth || this._lineWidth;
                color = color || this.getDrawColor();
                if (color.a == null)
                    color.a = 255;

                var vertices = [], t = 0.0;
                for (var i = 0; i < segments; i++) {
                    var x = Math.pow(1 - t, 2) * origin.x + 2.0 * (1 - t) * t * control.x + t * t * destination.x;
                    var y = Math.pow(1 - t, 2) * origin.y + 2.0 * (1 - t) * t * control.y + t * t * destination.y;
                    vertices.push(cc.p(x, y));
                    t += 1.0 / segments;
                }
                vertices.push(cc.p(destination.x, destination.y));

                var element = new cc._NvgNodeElement(_ccsg.NvgNode.TYPE_POLY);
                element.verts = vertices;
                element.lineWidth = lineWidth;
                element.lineColor = color;
                element.isStroke = true;
                element.lineCap = "round";
                this._buffer.push(element);
            },

            /**
             * draws a cubic bezier path
             * @override
             * @param {cc.Point} origin
             * @param {cc.Point} control1
             * @param {cc.Point} control2
             * @param {cc.Point} destination
             * @param {Number} segments
             * @param {Number} lineWidth
             * @param {cc.Color} color
             */
            drawCubicBezier: function (origin, control1, control2, destination, segments, lineWidth, color) {
                lineWidth = lineWidth || this._lineWidth;
                color = color || this.getDrawColor();
                if (color.a == null)
                    color.a = 255;

                var vertices = [], t = 0;
                for (var i = 0; i < segments; i++) {
                    var x = Math.pow(1 - t, 3) * origin.x + 3.0 * Math.pow(1 - t, 2) * t * control1.x + 3.0 * (1 - t) * t * t * control2.x + t * t * t * destination.x;
                    var y = Math.pow(1 - t, 3) * origin.y + 3.0 * Math.pow(1 - t, 2) * t * control1.y + 3.0 * (1 - t) * t * t * control2.y + t * t * t * destination.y;
                    vertices.push(cc.p(x, y));
                    t += 1.0 / segments;
                }
                vertices.push(cc.p(destination.x, destination.y));

                var element = new cc._NvgNodeElement(_ccsg.NvgNode.TYPE_POLY);
                element.verts = vertices;
                element.lineWidth = lineWidth;
                element.lineColor = color;
                element.isStroke = true;
                element.lineCap = "round";
                this._buffer.push(element);
            },

            /**
             * draw a CatmullRom curve
             * @override
             * @param {Array} points
             * @param {Number} segments
             * @param {Number} lineWidth
             * @param {cc.Color} color
             */
            drawCatmullRom: function (points, segments, lineWidth, color) {
                this.drawCardinalSpline(points, 0.5, segments, lineWidth, color);
            },

            /**
             * draw a cardinal spline path
             * @override
             * @param {Array} config
             * @param {Number} tension
             * @param {Number} segments
             * @param {Number} lineWidth
             * @param {cc.Color} color
             */
            drawCardinalSpline: function (config, tension, segments, lineWidth, color) {
                lineWidth = lineWidth || this._lineWidth;
                color = color || this.getDrawColor();
                if(color.a == null)
                    color.a = 255;

                var vertices = [], p, lt, deltaT = 1.0 / config.length;
                for (var i = 0; i < segments + 1; i++) {
                    var dt = i / segments;
                    // border
                    if (dt === 1) {
                        p = config.length - 1;
                        lt = 1;
                    } else {
                        p = 0 | (dt / deltaT);
                        lt = (dt - deltaT * p) / deltaT;
                    }

                    // Interpolate
                    var newPos = cc.cardinalSplineAt(
                        cc.getControlPointAt(config, p - 1),
                        cc.getControlPointAt(config, p - 0),
                        cc.getControlPointAt(config, p + 1),
                        cc.getControlPointAt(config, p + 2),
                        tension, lt);
                    vertices.push(newPos);
                }

                var element = new cc._NvgNodeElement(_ccsg.NvgNode.TYPE_POLY);
                element.verts = vertices;
                element.lineWidth = lineWidth;
                element.lineColor = color;
                element.isStroke = true;
                element.lineCap = "round";
                this._buffer.push(element);
            },

            /**
             * draw a dot at a position, with a given radius and color
             * @param {cc.Point} pos
             * @param {Number} radius
             * @param {cc.Color} color
             */
            drawDot: function (pos, radius, color) {
                color = color || this.getDrawColor();
                if (color.a == null)
                    color.a = 255;
                var element = new cc._NvgNodeElement(_ccsg.NvgNode.TYPE_DOT);
                element.verts = [pos];
                element.lineWidth = radius;
                element.fillColor = color;
                this._buffer.push(element);
            },

            /**
             * draws an array of points.
             * @override
             * @param {Array} points point of array
             * @param {Number} radius
             * @param {cc.Color} color
             */
            drawDots: function(points, radius, color){
                if(!points || points.length == 0)
                    return;
                color = color || this.getDrawColor();
                if (color.a == null)
                    color.a = 255;
                for(var i = 0, len = points.length; i < len; i++)
                   this.drawDot(points[i], radius, color);
            },

            /**
             * draw a segment with a radius and color
             * @param {cc.Point} from
             * @param {cc.Point} to
             * @param {Number} lineWidth
             * @param {cc.Color} color
             */
            drawSegment: function (from, to, lineWidth, color) {
                lineWidth = lineWidth || this._lineWidth;
                color = color || this.getDrawColor();
                if (color.a == null)
                    color.a = 255;
                var element = new cc._NvgNodeElement(_ccsg.NvgNode.TYPE_POLY);
                element.verts = [from, to];
                element.lineWidth = lineWidth * 2;
                element.lineColor = color;
                element.isStroke = true;
                element.lineCap = "round";
                this._buffer.push(element);
            },

            /**
             * draw a polygon with a fill color and line color without copying the vertex list
             * @param {Array} verts
             * @param {cc.Color} fillColor
             * @param {Number} lineWidth
             * @param {cc.Color} color
             */
            drawPoly_: function (verts, fillColor, lineWidth, color) {
                lineWidth = (lineWidth == null ) ? this._lineWidth : lineWidth;
                color = color || this.getDrawColor();
                if (color.a == null)
                    color.a = 255;
                var element = new cc._NvgNodeElement(_ccsg.NvgNode.TYPE_POLY);
                
                element.verts = verts;
                element.fillColor = fillColor;
                element.lineWidth = lineWidth;
                element.lineColor = color;
                element.isClosePolygon = true;
                element.isStroke = true;
                element.lineCap = "round";
                if (fillColor)
                    element.isFill = true;
                this._buffer.push(element);
            },
            
            /**
             * draw a polygon with a fill color and line color, copying the vertex list
             * @param {Array} verts
             * @param {cc.Color} fillColor
             * @param {Number} lineWidth
             * @param {cc.Color} color
             */
            drawPoly: function (verts, fillColor, lineWidth, color) {
                var vertsCopy = [];
                for (var i=0; i < verts.length; i++) {
                    vertsCopy.push(cc.p(verts[i].x, verts[i].y));
                }
                return this.drawPoly_(vertsCopy, fillColor, lineWidth, color);     
            },

            /**
             * Clear the geometry in the node's buffer.
             */
            clear: function () {
                this._buffer.length = 0;
            },

            _createRenderCmd: function(){
                return new _ccsg.NvgNode.CanvasRenderCmd(this);
            }
        });
    }
    else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
        
        cc.js.mixin(_ccsg.NvgNode.prototype, {
            _bufferCapacity:0,

            _trianglesArrayBuffer:null,
            _trianglesWebBuffer:null,
            _trianglesReader:null,

            _dirty:false,
            _className:"NvgNodeWebGL",

            ctor:function () {
                 _ccsg.Node.prototype.ctor.call(this);
                this._buffer = [];
                this._blendFunc = new cc.BlendFunc(cc.SRC_ALPHA, cc.ONE_MINUS_SRC_ALPHA);
                this._drawColor = cc.color(255,255,255,255);

                this.init();
            },

            init:function () {
                if ( _ccsg.Node.prototype.init.call(this)) {
                    this.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_LENGTHTEXTURECOLOR);
                    this._ensureCapacity(64);
                    this._trianglesWebBuffer = cc._renderContext.createBuffer();
                    this._dirty = true;
                    return true;
                }
                return false;
            },

            drawRect: function (origin, destination, fillColor, lineWidth, lineColor) {
                lineWidth = (lineWidth == null) ? this._lineWidth : lineWidth;
                lineColor = lineColor || this.getDrawColor();
                if (lineColor.a == null)
                    lineColor.a = 255;
                var vertices = [origin, cc.p(destination.x, origin.y), destination, cc.p(origin.x, destination.y)];
                if(fillColor == null)
                    this._drawSegments(vertices, lineWidth, lineColor, true);
                else
                    this.drawPoly(vertices, fillColor, lineWidth, lineColor);
            },

            drawCircle: function (center, radius, angle, segments, drawLineToCenter, lineWidth, color) {
                lineWidth = lineWidth || this._lineWidth;
                color = color || this.getDrawColor();
                if (color.a == null)
                    color.a = 255;
                var coef = 2.0 * Math.PI / segments, vertices = [], i, len;
                for (i = 0; i <= segments; i++) {
                    var rads = i * coef;
                    var j = radius * Math.cos(rads + angle) + center.x;
                    var k = radius * Math.sin(rads + angle) + center.y;
                    vertices.push(cc.p(j, k));
                }
                if (drawLineToCenter)
                    vertices.push(cc.p(center.x, center.y));

                lineWidth *= 0.5;
                for (i = 0, len = vertices.length; i < len - 1; i++)
                    this.drawSegment(vertices[i], vertices[i + 1], lineWidth, color);
            },

            drawQuadBezier: function (origin, control, destination, segments, lineWidth, color) {
                lineWidth = lineWidth || this._lineWidth;
                color = color || this.getDrawColor();
                if (color.a == null)
                    color.a = 255;
                var vertices = [], t = 0.0;
                for (var i = 0; i < segments; i++) {
                    var x = Math.pow(1 - t, 2) * origin.x + 2.0 * (1 - t) * t * control.x + t * t * destination.x;
                    var y = Math.pow(1 - t, 2) * origin.y + 2.0 * (1 - t) * t * control.y + t * t * destination.y;
                    vertices.push(cc.p(x, y));
                    t += 1.0 / segments;
                }
                vertices.push(cc.p(destination.x, destination.y));
                this._drawSegments(vertices, lineWidth, color, false);
            },

            drawCubicBezier: function (origin, control1, control2, destination, segments, lineWidth, color) {
                lineWidth = lineWidth || this._lineWidth;
                color = color || this.getDrawColor();
                if (color.a == null)
                    color.a = 255;
                var vertices = [], t = 0;
                for (var i = 0; i < segments; i++) {
                    var x = Math.pow(1 - t, 3) * origin.x + 3.0 * Math.pow(1 - t, 2) * t * control1.x + 3.0 * (1 - t) * t * t * control2.x + t * t * t * destination.x;
                    var y = Math.pow(1 - t, 3) * origin.y + 3.0 * Math.pow(1 - t, 2) * t * control1.y + 3.0 * (1 - t) * t * t * control2.y + t * t * t * destination.y;
                    vertices.push(cc.p(x, y));
                    t += 1.0 / segments;
                }
                vertices.push(cc.p(destination.x, destination.y));
                this._drawSegments(vertices, lineWidth, color, false);
            },

            drawCatmullRom: function (points, segments, lineWidth, color) {
                this.drawCardinalSpline(points, 0.5, segments, lineWidth, color);
            },

            drawCardinalSpline: function (config, tension, segments, lineWidth, color) {
                lineWidth = lineWidth || this._lineWidth;
                color = color || this.getDrawColor();
                if (color.a == null)
                    color.a = 255;
                var vertices = [], p, lt, deltaT = 1.0 / config.length;

                for (var i = 0; i < segments + 1; i++) {
                    var dt = i / segments;

                    // border
                    if (dt === 1) {
                        p = config.length - 1;
                        lt = 1;
                    } else {
                        p = 0 | (dt / deltaT);
                        lt = (dt - deltaT * p) / deltaT;
                    }

                    // Interpolate
                    var newPos = cc.cardinalSplineAt(
                        cc.getControlPointAt(config, p - 1),
                        cc.getControlPointAt(config, p - 0),
                        cc.getControlPointAt(config, p + 1),
                        cc.getControlPointAt(config, p + 2),
                        tension, lt);
                    vertices.push(newPos);
                }

                lineWidth *= 0.5;
                for (var j = 0, len = vertices.length; j < len - 1; j++)
                    this.drawSegment(vertices[j], vertices[j + 1], lineWidth, color);
            },

            _render:function () {
                var gl = cc._renderContext;

                cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX);
                gl.bindBuffer(gl.ARRAY_BUFFER, this._trianglesWebBuffer);
                if (this._dirty) {
                    gl.bufferData(gl.ARRAY_BUFFER, this._trianglesArrayBuffer, gl.STREAM_DRAW);
                    this._dirty = false;
                }
                var triangleSize = cc.V2F_C4B_T2F.BYTES_PER_ELEMENT;

                // vertex
                gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, gl.FLOAT, false, triangleSize, 0);
                // color
                gl.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, gl.UNSIGNED_BYTE, true, triangleSize, 8);
                // texcood
                gl.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, gl.FLOAT, false, triangleSize, 12);

                gl.drawArrays(gl.TRIANGLES, 0, this._buffer.length * 3);
                cc.incrementGLDraws(1);
                //cc.checkGLErrorDebug();
            },

            _ensureCapacity:function(count){
                var _t = this;
                var locBuffer = _t._buffer;
                if(locBuffer.length + count > _t._bufferCapacity){
                    var TriangleLength = cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT;
                    _t._bufferCapacity += Math.max(_t._bufferCapacity, count);
                    //re alloc
                    if((locBuffer == null) || (locBuffer.length === 0)){
                        //init
                        _t._buffer = [];
                        _t._trianglesArrayBuffer = new ArrayBuffer(TriangleLength * _t._bufferCapacity);
                        _t._trianglesReader = new Uint8Array(_t._trianglesArrayBuffer);
                    } else {
                        var newTriangles = [];
                        var newArrayBuffer = new ArrayBuffer(TriangleLength * _t._bufferCapacity);
                        for(var i = 0; i < locBuffer.length;i++){
                            newTriangles[i] = new cc.V2F_C4B_T2F_Triangle(locBuffer[i].a,locBuffer[i].b,locBuffer[i].c,
                                newArrayBuffer, i * TriangleLength);
                        }
                        _t._trianglesReader = new Uint8Array(newArrayBuffer);
                        _t._trianglesArrayBuffer = newArrayBuffer;
                        _t._buffer = newTriangles;
                    }
                }
            },

            drawDot:function (pos, radius, color) {
                color = color || this.getDrawColor();
                if (color.a == null)
                    color.a = 255;
                var c4bColor = {r: 0 | color.r, g: 0 | color.g, b: 0 | color.b, a: 0 | color.a};
                var a = {vertices: {x: pos.x - radius, y: pos.y - radius}, colors: c4bColor, texCoords: {u: -1.0, v: -1.0}};
                var b = {vertices: {x: pos.x - radius, y: pos.y + radius}, colors: c4bColor, texCoords: {u: -1.0, v: 1.0}};
                var c = {vertices: {x: pos.x + radius, y: pos.y + radius}, colors: c4bColor, texCoords: {u: 1.0, v: 1.0}};
                var d = {vertices: {x: pos.x + radius, y: pos.y - radius}, colors: c4bColor, texCoords: {u: 1.0, v: -1.0}};

                this._ensureCapacity(2*3);

                this._buffer.push(new cc.V2F_C4B_T2F_Triangle(a, b, c, this._trianglesArrayBuffer, this._buffer.length * cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT));
                this._buffer.push(new cc.V2F_C4B_T2F_Triangle(a, c, d, this._trianglesArrayBuffer, this._buffer.length * cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT));
                this._dirty = true;
            },

            drawDots: function(points, radius,color) {
                if(!points || points.length === 0)
                    return;
                color = color || this.getDrawColor();
                if (color.a == null)
                    color.a = 255;
                for(var i = 0, len = points.length; i < len; i++)
                    this.drawDot(points[i], radius, color);
            },

            drawSegment:function (from, to, radius, color) {
                color = color || this.getDrawColor();
                if (color.a == null)
                    color.a = 255;
                radius = radius || (this._lineWidth * 0.5);
                var vertexCount = 6*3;
                this._ensureCapacity(vertexCount);

                var c4bColor = {r: 0 | color.r, g: 0 | color.g, b: 0 | color.b, a: 0 | color.a};
                var a = cc.__v2f(from), b = cc.__v2f(to);
                var n = cc.v2fnormalize(cc.v2fperp(cc.v2fsub(b, a))), t = cc.v2fperp(n);
                var nw = cc.v2fmult(n, radius), tw = cc.v2fmult(t, radius);

                var v0 = cc.v2fsub(b, cc.v2fadd(nw, tw));
                var v1 = cc.v2fadd(b, cc.v2fsub(nw, tw));
                var v2 = cc.v2fsub(b, nw);
                var v3 = cc.v2fadd(b, nw);
                var v4 = cc.v2fsub(a, nw);
                var v5 = cc.v2fadd(a, nw);
                var v6 = cc.v2fsub(a, cc.v2fsub(nw, tw));
                var v7 = cc.v2fadd(a, cc.v2fadd(nw, tw));

                var TriangleLength = cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT, triangleBuffer = this._trianglesArrayBuffer, locBuffer = this._buffer;
                locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: v0, colors: c4bColor, texCoords: cc.__t(cc.v2fneg(cc.v2fadd(n, t)))},
                    {vertices: v1, colors: c4bColor, texCoords: cc.__t(cc.v2fsub(n, t))}, {vertices: v2, colors: c4bColor, texCoords: cc.__t(cc.v2fneg(n))},
                    triangleBuffer, locBuffer.length * TriangleLength));

                locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: v3, colors: c4bColor, texCoords: cc.__t(n)},
                    {vertices: v1, colors: c4bColor, texCoords: cc.__t(cc.v2fsub(n, t))}, {vertices: v2, colors: c4bColor, texCoords: cc.__t(cc.v2fneg(n))},
                    triangleBuffer, locBuffer.length * TriangleLength));

                locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: v3, colors: c4bColor, texCoords: cc.__t(n)},
                    {vertices: v4, colors: c4bColor, texCoords: cc.__t(cc.v2fneg(n))}, {vertices: v2, colors: c4bColor, texCoords: cc.__t(cc.v2fneg(n))},
                    triangleBuffer, locBuffer.length * TriangleLength));

                locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: v3, colors: c4bColor, texCoords: cc.__t(n)},
                    {vertices: v4, colors: c4bColor, texCoords: cc.__t(cc.v2fneg(n))}, {vertices: v5, colors: c4bColor, texCoords: cc.__t(n)},
                    triangleBuffer, locBuffer.length * TriangleLength));

                locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: v6, colors: c4bColor, texCoords: cc.__t(cc.v2fsub(t, n))},
                    {vertices: v4, colors: c4bColor, texCoords: cc.__t(cc.v2fneg(n))}, {vertices: v5, colors: c4bColor, texCoords: cc.__t(n)},
                    triangleBuffer, locBuffer.length * TriangleLength));

                locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: v6, colors: c4bColor, texCoords: cc.__t(cc.v2fsub(t, n))},
                    {vertices: v7, colors: c4bColor, texCoords: cc.__t(cc.v2fadd(n, t))}, {vertices: v5, colors: c4bColor, texCoords: cc.__t(n)},
                    triangleBuffer, locBuffer.length * TriangleLength));
                this._dirty = true;
            },

            drawPoly:function (verts, fillColor, borderWidth, borderColor) {
                if(fillColor == null){
                    this._drawSegments(verts, borderWidth, borderColor, true);
                    return;
                }
                if (fillColor.a == null)
                    fillColor.a = 255;
                if (borderColor.a == null)
                    borderColor.a = 255;
                borderWidth = (borderWidth == null)? this._lineWidth : borderWidth;
                borderWidth *= 0.5;
                var c4bFillColor = {r: 0 | fillColor.r, g: 0 | fillColor.g, b: 0 | fillColor.b, a: 0 | fillColor.a};
                var c4bBorderColor = {r: 0 | borderColor.r, g: 0 | borderColor.g, b: 0 | borderColor.b, a: 0 | borderColor.a};
                var extrude = [], i, v0, v1, v2, count = verts.length;
                for (i = 0; i < count; i++) {
                    v0 = cc.__v2f(verts[(i - 1 + count) % count]);
                    v1 = cc.__v2f(verts[i]);
                    v2 = cc.__v2f(verts[(i + 1) % count]);
                    var n1 = cc.v2fnormalize(cc.v2fperp(cc.v2fsub(v1, v0)));
                    var n2 = cc.v2fnormalize(cc.v2fperp(cc.v2fsub(v2, v1)));
                    var offset = cc.v2fmult(cc.v2fadd(n1, n2), 1.0 / (cc.v2fdot(n1, n2) + 1.0));
                    extrude[i] = {offset: offset, n: n2};
                }
                var outline = (borderWidth > 0.0), triangleCount = 3 * count - 2, vertexCount = 3 * triangleCount;
                this._ensureCapacity(vertexCount);

                var triangleBytesLen = cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT, trianglesBuffer = this._trianglesArrayBuffer;
                var locBuffer = this._buffer;
                var inset = (outline == false ? 0.5 : 0.0);
                for (i = 0; i < count - 2; i++) {
                    v0 = cc.v2fsub(cc.__v2f(verts[0]), cc.v2fmult(extrude[0].offset, inset));
                    v1 = cc.v2fsub(cc.__v2f(verts[i + 1]), cc.v2fmult(extrude[i + 1].offset, inset));
                    v2 = cc.v2fsub(cc.__v2f(verts[i + 2]), cc.v2fmult(extrude[i + 2].offset, inset));
                    locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: v0, colors: c4bFillColor, texCoords: cc.__t(cc.v2fzero())},
                        {vertices: v1, colors: c4bFillColor, texCoords: cc.__t(cc.v2fzero())}, {vertices: v2, colors: c4bFillColor, texCoords: cc.__t(cc.v2fzero())},
                        trianglesBuffer, locBuffer.length * triangleBytesLen));
                }

                for (i = 0; i < count; i++) {
                    var j = (i + 1) % count;
                    v0 = cc.__v2f(verts[i]);
                    v1 = cc.__v2f(verts[j]);

                    var n0 = extrude[i].n;
                    var offset0 = extrude[i].offset;
                    var offset1 = extrude[j].offset;
                    var inner0 = outline ? cc.v2fsub(v0, cc.v2fmult(offset0, borderWidth)) : cc.v2fsub(v0, cc.v2fmult(offset0, 0.5));
                    var inner1 = outline ? cc.v2fsub(v1, cc.v2fmult(offset1, borderWidth)) : cc.v2fsub(v1, cc.v2fmult(offset1, 0.5));
                    var outer0 = outline ? cc.v2fadd(v0, cc.v2fmult(offset0, borderWidth)) : cc.v2fadd(v0, cc.v2fmult(offset0, 0.5));
                    var outer1 = outline ? cc.v2fadd(v1, cc.v2fmult(offset1, borderWidth)) : cc.v2fadd(v1, cc.v2fmult(offset1, 0.5));

                    if (outline) {
                        locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: inner0, colors: c4bBorderColor, texCoords: cc.__t(cc.v2fneg(n0))},
                            {vertices: inner1, colors: c4bBorderColor, texCoords: cc.__t(cc.v2fneg(n0))}, {vertices: outer1, colors: c4bBorderColor, texCoords: cc.__t(n0)},
                            trianglesBuffer, locBuffer.length * triangleBytesLen));
                        locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: inner0, colors: c4bBorderColor, texCoords: cc.__t(cc.v2fneg(n0))},
                            {vertices: outer0, colors: c4bBorderColor, texCoords: cc.__t(n0)}, {vertices: outer1, colors: c4bBorderColor, texCoords: cc.__t(n0)},
                            trianglesBuffer, locBuffer.length * triangleBytesLen));
                    } else {
                        locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: inner0, colors: c4bFillColor, texCoords: cc.__t(cc.v2fzero())},
                            {vertices: inner1, colors: c4bFillColor, texCoords: cc.__t(cc.v2fzero())}, {vertices: outer1, colors: c4bFillColor, texCoords: cc.__t(n0)},
                            trianglesBuffer, locBuffer.length * triangleBytesLen));
                        locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: inner0, colors: c4bFillColor, texCoords: cc.__t(cc.v2fzero())},
                            {vertices: outer0, colors: c4bFillColor, texCoords: cc.__t(n0)}, {vertices: outer1, colors: c4bFillColor, texCoords: cc.__t(n0)},
                            trianglesBuffer, locBuffer.length * triangleBytesLen));
                    }
                }
                extrude = null;
                this._dirty = true;
            },

            _drawSegments: function(verts, borderWidth, borderColor, closePoly){
                borderWidth = (borderWidth == null) ? this._lineWidth : borderWidth;
                borderColor = borderColor || this._drawColor;
                if(borderColor.a == null)
                    borderColor.a = 255;
                borderWidth *= 0.5;
                if (borderWidth <= 0)
                    return;

                var c4bBorderColor = {r: 0 | borderColor.r, g: 0 | borderColor.g, b: 0 | borderColor.b, a: 0 | borderColor.a };
                var extrude = [], i, v0, v1, v2, count = verts.length;
                for (i = 0; i < count; i++) {
                    v0 = cc.__v2f(verts[(i - 1 + count) % count]);
                    v1 = cc.__v2f(verts[i]);
                    v2 = cc.__v2f(verts[(i + 1) % count]);
                    var n1 = cc.v2fnormalize(cc.v2fperp(cc.v2fsub(v1, v0)));
                    var n2 = cc.v2fnormalize(cc.v2fperp(cc.v2fsub(v2, v1)));
                    var offset = cc.v2fmult(cc.v2fadd(n1, n2), 1.0 / (cc.v2fdot(n1, n2) + 1.0));
                    extrude[i] = {offset: offset, n: n2};
                }

                var triangleCount = 3 * count - 2, vertexCount = 3 * triangleCount;
                this._ensureCapacity(vertexCount);

                var triangleBytesLen = cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT, trianglesBuffer = this._trianglesArrayBuffer;
                var locBuffer = this._buffer;
                var len = closePoly ? count : count - 1;
                for (i = 0; i < len; i++) {
                    var j = (i + 1) % count;
                    v0 = cc.__v2f(verts[i]);
                    v1 = cc.__v2f(verts[j]);

                    var n0 = extrude[i].n;
                    var offset0 = extrude[i].offset;
                    var offset1 = extrude[j].offset;
                    var inner0 = cc.v2fsub(v0, cc.v2fmult(offset0, borderWidth));
                    var inner1 = cc.v2fsub(v1, cc.v2fmult(offset1, borderWidth));
                    var outer0 = cc.v2fadd(v0, cc.v2fmult(offset0, borderWidth));
                    var outer1 = cc.v2fadd(v1, cc.v2fmult(offset1, borderWidth));
                    locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: inner0, colors: c4bBorderColor, texCoords: cc.__t(cc.v2fneg(n0))},
                        {vertices: inner1, colors: c4bBorderColor, texCoords: cc.__t(cc.v2fneg(n0))}, {vertices: outer1, colors: c4bBorderColor, texCoords: cc.__t(n0)},
                        trianglesBuffer, locBuffer.length * triangleBytesLen));
                    locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: inner0, colors: c4bBorderColor, texCoords: cc.__t(cc.v2fneg(n0))},
                        {vertices: outer0, colors: c4bBorderColor, texCoords: cc.__t(n0)}, {vertices: outer1, colors: c4bBorderColor, texCoords: cc.__t(n0)},
                        trianglesBuffer, locBuffer.length * triangleBytesLen));
                }
                extrude = null;
                this._dirty = true;
            },

            clear:function () {
                this._buffer.length = 0;
                this._dirty = true;
            },

            _createRenderCmd: function () {
                return new _ccsg.NvgNode.WebGLRenderCmd(this);
            }
        });
    }
});
