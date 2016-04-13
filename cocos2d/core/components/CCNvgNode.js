/****************************************************************************
 Copyright (c) 2016 Colin3dmax
 www.cross2d.com
 ****************************************************************************/

/**
 * !#en The NvgNode Component.
 * !#zh Nvg渲染组件
 * @class NvgNode
 * @extends _RendererUnderSG
 */
var NvgNode = cc.Class({
    name: 'cc.NvgNode',
    extends: cc._RendererUnderSG,

    editor: CC_EDITOR && {
        menu: 'NvgNode',
        help: 'www.cross2d.com',
    },

    properties: {
        
    },

    onLoad: function () {
        this._super();
    },

    _createSgNode: function () {
        return new _ccsg.NvgNode();
    },

    _initSgNode: function () {
        var sgNode = this._sgNode;
    },
    registerScriptDrawHandler:function(func){
        this._sgNode.registerScriptDrawHandler(func);
    }
 });

 cc.NvgNode = module.exports = NvgNode;
