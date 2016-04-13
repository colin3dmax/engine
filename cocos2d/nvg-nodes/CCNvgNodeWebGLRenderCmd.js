/****************************************************************************
 Copyright (c) 2016 Colin3dmax
 http://www.cross2d.com
 ****************************************************************************/

cc.NvgNode.WebGLRenderCmd = function (renderableObject) {
    _ccsg.Node.WebGLRenderCmd.call(this, renderableObject);
    this._needDraw = true;
};

cc.NvgNode.WebGLRenderCmd.prototype = Object.create(_ccsg.Node.WebGLRenderCmd.prototype);
cc.NvgNode.WebGLRenderCmd.prototype.constructor = cc.NvgNode.WebGLRenderCmd;

cc.NvgNode.WebGLRenderCmd.prototype.rendering = function (ctx) {
    var node = this._node;
    cc.gl.blendFunc(node._blendFunc.src, node._blendFunc.dst);
    this._shaderProgram.use();
    this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix);
    node._render();
};