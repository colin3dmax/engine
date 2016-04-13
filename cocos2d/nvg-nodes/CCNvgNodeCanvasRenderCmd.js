/****************************************************************************
 Copyright (c) 2016 Colin3dmax
 http://www.cross2d.com
 ****************************************************************************/
 
(function(){

    cc.NvgNode.CanvasRenderCmd = function(renderableObject){
        cc.Node.CanvasRenderCmd.call(this, renderableObject);
        this._needDraw = true;
        this._buffer = null;
        this._drawColor = null;
        this._blendFunc = null;
    };

    cc.NvgNode.CanvasRenderCmd.prototype = Object.create(cc.Node.CanvasRenderCmd.prototype);
    cc.NvgNode.CanvasRenderCmd.prototype.constructor = cc.NvgNode.CanvasRenderCmd;
    cc.extend( cc.NvgNode.CanvasRenderCmd.prototype, {
        rendering: function (ctx, scaleX, scaleY) {
            var wrapper = ctx || cc._renderContext, context = wrapper.getContext(), node = this._node;
            var alpha = node._displayedOpacity / 255;
            if (alpha === 0)
                return;

            wrapper.setTransform(this._worldTransform, scaleX, scaleY);

            //context.save();
            wrapper.setGlobalAlpha(alpha);
            if ((this._blendFunc && (this._blendFunc.src === cc.SRC_ALPHA) && (this._blendFunc.dst === cc.ONE)))
                wrapper.setCompositeOperation('lighter');               //todo: need refactor
            var locBuffer = this._buffer;
            for (var i = 0, len = locBuffer.length; i < len; i++) {
                var element = locBuffer[i];
                switch (element.type) {
                    case cc.NvgNode.TYPE_DOT:
                        this._drawDot(wrapper, element, scaleX, scaleY);
                        break;
                    case cc.NvgNode.TYPE_SEGMENT:
                        this._drawSegment(wrapper, element, scaleX, scaleY);
                        break;
                    case cc.NvgNode.TYPE_POLY:
                        this._drawPoly(wrapper, element, scaleX, scaleY);
                        break;
                }
            }
            //context.restore();            //todo It can be reserve

            if(typeof(node.draw)==="function"){
                
                if(node.wrapper==null){
                    node.wrapper = wrapper;
                }
                node.draw();
            }
        },

        _drawDot: function (wrapper, element, scaleX, scaleY) {
            var locColor = element.fillColor, locPos = element.verts[0], locRadius = element.lineWidth;

            var ctx = wrapper.getContext();
            wrapper.setFillStyle("rgba(" + (0 | locColor.r) + "," + (0 | locColor.g) + "," + (0 | locColor.b) + "," + locColor.a / 255 + ")");

            ctx.beginPath();
            ctx.arc(locPos.x * scaleX, -locPos.y * scaleY, locRadius * scaleX, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
        },

        _drawSegment: function (wrapper, element, scaleX, scaleY) {
            var locColor = element.lineColor;
            var locFrom = element.verts[0], locTo = element.verts[1];
            var locLineWidth = element.lineWidth, locLineCap = element.lineCap;

            var ctx = wrapper.getContext();
            wrapper.setStrokeStyle("rgba(" + (0 | locColor.r) + "," + (0 | locColor.g) + "," + (0 | locColor.b) + "," + locColor.a / 255 + ")");

            ctx.lineWidth = locLineWidth * scaleX;
            ctx.beginPath();
            ctx.lineCap = locLineCap;
            ctx.moveTo(locFrom.x * scaleX, -locFrom.y * scaleY);
            ctx.lineTo(locTo.x * scaleX, -locTo.y * scaleY);
            ctx.stroke();
        },

        _drawPoly: function (wrapper, element, scaleX, scaleY) {
            var locVertices = element.verts, locLineCap = element.lineCap;
            if (locVertices == null)
                return;

            var locFillColor = element.fillColor, locLineWidth = element.lineWidth;
            var locLineColor = element.lineColor, locIsClosePolygon = element.isClosePolygon;
            var locIsFill = element.isFill, locIsStroke = element.isStroke;

            var ctx = wrapper.getContext();
            var firstPoint = locVertices[0];
            ctx.lineCap = locLineCap;
            if (locFillColor)
                wrapper.setFillStyle("rgba(" + (0 | locFillColor.r) + "," + (0 | locFillColor.g) + ","
                    + (0 | locFillColor.b) + "," + locFillColor.a / 255 + ")");
            if (locLineWidth)
                ctx.lineWidth = locLineWidth * scaleX;
            if (locLineColor)
                wrapper.setStrokeStyle("rgba(" + (0 | locLineColor.r) + "," + (0 | locLineColor.g) + ","
                    + (0 | locLineColor.b) + "," + locLineColor.a / 255 + ")");

            ctx.beginPath();
            ctx.moveTo(firstPoint.x * scaleX, -firstPoint.y * scaleY);
            for (var i = 1, len = locVertices.length; i < len; i++)
                ctx.lineTo(locVertices[i].x * scaleX, -locVertices[i].y * scaleY);

            if (locIsClosePolygon)
                ctx.closePath();
            if (locIsFill)
                ctx.fill();
            if (locIsStroke)
                ctx.stroke();
        }
    });
    
})();
