/****************************************************************************
 Copyright (c) 2016 Colin3dmax
 http://www.cross2d.com
 ****************************************************************************/
 (function () {
	_ccsg.NvgNode.WebGLRenderCmd = function (renderableObject) {
	    _ccsg.Node.WebGLRenderCmd.call(this, renderableObject);
	    this._needDraw = true;
	};

	var proto =_ccsg.NvgNode.WebGLRenderCmd.prototype = Object.create(_ccsg.Node.WebGLRenderCmd.prototype);
	proto.constructor = _ccsg.NvgNode.WebGLRenderCmd;

	proto.rendering = function (ctx) {
	    var node = this._node;
	    cc.gl.blendFunc(node._blendFunc.src, node._blendFunc.dst);
	    this._shaderProgram.use();
	    this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix);
	    node._render();
	};

	proto.visit = function(parentCmd){
	    var node = this._node;
	    // CAREFUL:
	    // This visit is almost identical to _ccsg.Node#visit
	    // with the exception that it doesn't call visit on it's children
	    //
	    // The alternative is to have a void _ccsg.Sprite#visit, but
	    // although this is less mantainable, is faster
	    //
	    if (!node._visible)
	        return;

	    var currentStack = cc.current_stack;
	    currentStack.stack.push(currentStack.top);
	    this._syncStatus(parentCmd);
	    currentStack.top = this._stackMatrix;
	    //this.draw(ctx);
	    cc.renderer.pushRenderCommand(this);

	    this._dirtyFlag = 0;
	    cc.math.glPopMatrix();
	};


})();