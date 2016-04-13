/****************************************************************************
 Copyright (c) 2016 Colin3dmax
 http://www.cross2d.com
 ****************************************************************************/

_ccsg.NvgNode.WebGLRenderCmd = function (renderableObject) {
    _ccsg.Node.WebGLRenderCmd.call(this, renderableObject);
    this._needDraw = true;
};

_ccsg.NvgNode.WebGLRenderCmd.prototype = Object.create(_ccsg.Node.WebGLRenderCmd.prototype);
_ccsg.NvgNode.WebGLRenderCmd.prototype.constructor = _ccsg.NvgNode.WebGLRenderCmd;

_ccsg.NvgNode.WebGLRenderCmd.prototype.rendering = function (ctx) {
    var node = this._node;
    cc.gl.blendFunc(node._blendFunc.src, node._blendFunc.dst);
    this._shaderProgram.use();
    this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix);
    node._render();
};