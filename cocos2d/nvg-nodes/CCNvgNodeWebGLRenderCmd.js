/****************************************************************************
 Copyright (c) 2016 Colin3dmax
 http://www.cross2d.com
 ****************************************************************************/

(function(){
    cc.NvgNode.WebGLRenderCmd = function (renderableObject) {
        cc.Node.WebGLRenderCmd.call(this, renderableObject);
        this._needDraw = true;
    };

    cc.NvgNode.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    cc.NvgNode.WebGLRenderCmd.prototype.constructor = cc.NvgNode.WebGLRenderCmd;

    cc.NvgNode.WebGLRenderCmd.prototype.rendering = function (ctx) {
        var node = this._node;
        cc.glBlendFunc(node._blendFunc.src, node._blendFunc.dst);
        this._shaderProgram.use();
        this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix);
        node._render();
    };
})();