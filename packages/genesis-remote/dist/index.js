"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteView = exports.loadScript = exports.loadStyle = void 0;
/* eslint-disable @typescript-eslint/prefer-for-of */
var vue_1 = __importDefault(require("vue"));
var format_1 = require("./format");
var remoteViewStateKey = '__remote_view_state__';
var isPromise = function (obj) {
    return (!!obj &&
        (typeof obj === 'object' || typeof obj === 'function') &&
        typeof obj.then === 'function');
};
//  Object.values 支持
if (!Object.values) {
    Object.values = function (obj) {
        if (obj !== Object(obj))
            throw new TypeError('Object.values called on a non-object');
        var val = [];
        var key;
        for (key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                val.push(obj[key]);
            }
        }
        return val;
    };
}
/**
 * el 加载的元素
 * bool 在 doc 中是否已经存在
 */
var onload = function (el, bool) {
    // 暂时先处理成已经加载成功
    if (bool === true && !('_loading' in el)) {
        return Promise.resolve(true);
    }
    // 已经加载成功
    if (el._loading === false) {
        return Promise.resolve(true);
    }
    // 正在加载中
    if (el._loading === true) {
        return new Promise(function (resolve) {
            el._loadArr.push(resolve);
            el._loadArr = [];
        });
    }
    // 首次加载
    return new Promise(function (resolve, reject) {
        var load = function () {
            el._loadArr.forEach(function (fn) { return fn(); });
            el._loading = false;
            resolve(true);
        };
        var error = function () {
            el._loadArr.forEach(function (fn) { return fn(); });
            el._loading = false;
            resolve(false);
        };
        el.addEventListener('load', load, false);
        el.addEventListener('error', error, false);
        el._loading = true;
        el._loadArr = [];
    });
};
/**
 * 加载样式文件
 */
exports.loadStyle = function (html) {
    var doc = document.createDocumentFragment();
    var div = document.createElement('div');
    div.innerHTML = html;
    var arr = [];
    var linkArr = document.querySelectorAll('link[rel=stylesheet][href]');
    var findOne = function (href) {
        for (var i = 0; i < linkArr.length; i++) {
            if (linkArr[i].href === href) {
                return linkArr[i];
            }
        }
        return null;
    };
    var installArr = [];
    var forEach = function (el) {
        if (el instanceof HTMLLinkElement &&
            el.rel === 'stylesheet' &&
            el.href) {
            var docLink = findOne(el.href);
            if (docLink) {
                arr.push(onload(docLink, true));
                return;
            }
            else {
                arr.push(onload(el, false));
            }
        }
        installArr.push(el);
    };
    for (var i = 0; i < div.children.length; i++) {
        forEach(div.children[i]);
    }
    installArr.forEach(function (el) {
        doc.appendChild(el);
    });
    document.head.appendChild(doc);
    return Promise.all(arr);
};
/**
 * 加载js文件
 */
exports.loadScript = function (html) {
    var doc = document.createDocumentFragment();
    var div = document.createElement('div');
    div.innerHTML = html;
    var arr = [];
    var scriptArr = document.querySelectorAll('script[src]');
    var findOne = function (src) {
        for (var i = 0; i < scriptArr.length; i++) {
            if (scriptArr[i].src === src) {
                return scriptArr[i];
            }
        }
        return null;
    };
    var installArr = [];
    var forEach = function (el) {
        if (el instanceof HTMLScriptElement && el.src) {
            var docLink = findOne(el.src);
            if (docLink) {
                arr.push(onload(docLink, true));
                return;
            }
            else {
                var newScript_1 = document.createElement('script');
                var attrs = Object.values(el.attributes);
                newScript_1.async = false;
                attrs.forEach(function (attr) {
                    var value = el.getAttribute(attr.name);
                    newScript_1.setAttribute(attr.name, value);
                });
                newScript_1.src = el.src;
                arr.push(onload(newScript_1, false));
                installArr.push(newScript_1);
                return;
            }
        }
        installArr.push(el);
    };
    for (var i = 0; i < div.children.length; i++) {
        forEach(div.children[i]);
    }
    installArr.forEach(function (el) {
        doc.appendChild(el);
    });
    document.body.appendChild(doc);
    return Promise.all(arr);
};
/**
 * 远程调用组件
 */
exports.RemoteView = {
    name: 'remote-view',
    props: {
        fetch: {
            type: Function
        },
        clientFetch: {
            type: Function
        },
        serverFetch: {
            type: Function
        }
    },
    data: function () {
        return {
            // 安装的选项
            installOptions: {},
            // 远程请求到的数据
            localData: {
                style: '',
                script: '',
                html: ''
            },
            // 组件渲染的下标
            index: 0,
            // 应用安装的id
            appId: 0,
            // 当前组件是否已销毁
            destroyed: false,
            // 是否需要客户端加载远程组件
            needClientLoad: true
        };
    },
    created: function () {
        if (process.env.VUE_ENV === 'client') {
            if (!this.$root.$options.clientOptions)
                return;
            this.initClient();
        }
        if (process.env.VUE_ENV === 'server') {
            if (!this.$root.$options.renderContext)
                return;
            this.initServer();
        }
    },
    render: function (h) {
        return h('div', {
            domProps: {
                innerHTML: this.localData.html
            }
        });
    },
    mounted: function () {
        if (this.needClientLoad) {
            this.clientLoad();
        }
        else {
            this.$nextTick(this.install);
        }
    },
    beforeDestroy: function () {
        if (this.appId) {
            window.genesis.uninstall(this.appId);
        }
        this.destroyed = true;
    },
    methods: {
        _fetch: function () {
            try {
                var fetch_1 = this.fetch;
                if (process.env.VUE_ENV === 'server' &&
                    typeof this.serverFetch === 'function') {
                    fetch_1 = this.serverFetch;
                }
                if (process.env.VUE_ENV === 'client' &&
                    typeof this.clientFetch === 'function') {
                    fetch_1 = this.clientFetch;
                }
                if (typeof fetch_1 !== 'function') {
                    return Promise.resolve(null);
                }
                var res = fetch_1();
                if (isPromise(res)) {
                    return res
                        .then(function (data) {
                        if (typeof data !== 'object')
                            return null;
                        return data;
                    })
                        .catch(function (e) {
                        console.error('[remote-view] Error calling fetch', e);
                        return null;
                    });
                }
                return Promise.resolve(null);
            }
            catch (e) {
                console.error('[remote-view] Error calling fetch', e);
                return Promise.resolve(null);
            }
        },
        install: function () {
            var _this = this;
            this.$nextTick(function () {
                var options = __assign(__assign({}, _this.installOptions), { mounted: function (app) {
                        Object.keys(_this.$listeners).forEach(function (name) {
                            app.$on(name, _this.$listeners[name]);
                        });
                    } });
                if (!_this.$el.firstChild)
                    return;
                Object.defineProperty(options, 'el', {
                    enumerable: false,
                    value: _this.$el.firstChild
                });
                if (options.el && window.genesis && !_this.destroyed) {
                    _this.$emit('install', options);
                    _this.appId = window.genesis.install(options);
                }
            });
        },
        initServer: function () {
            var context = this.$root.$options.renderContext;
            var state = context.data.state;
            var first = !state[remoteViewStateKey];
            state[remoteViewStateKey] = state[remoteViewStateKey] || [];
            this.index = state[remoteViewStateKey].length;
            state[remoteViewStateKey].push(this.localData);
            Object.defineProperty(this.localData, 'style', {
                enumerable: false
            });
            Object.defineProperty(this.localData, 'script', {
                enumerable: false
            });
            Object.defineProperty(this.localData, 'html', {
                enumerable: false
            });
            if (!first)
                return;
            /**
             * 渲染完成后，对js和样式进行去重
             */
            context.beforeRender(format_1.beforeRender);
        },
        initClient: function () {
            var clientOptions = this.$root.$options
                .clientOptions;
            var state = clientOptions.state;
            // 热更新可能会不存在数组，或者数组已经被清空了。
            if (!state[remoteViewStateKey] || !state[remoteViewStateKey].length)
                return;
            var data = state[remoteViewStateKey].splice(0, 1)[0];
            // 这里服务器端加载失败，要调整到客户端加载
            if (!data.id)
                return;
            var el = document.querySelector("[data-ssr-genesis-id=\"" + data.id + "\"]");
            if (!el)
                return;
            this.localData.html = el.parentNode.innerHTML;
            this.installOptions = __assign({}, data);
            // 服务器端已经加载，客户端不需要再重新加载
            this.needClientLoad = false;
        },
        clientLoad: function () {
            var _this = this;
            var haveFlase = function (arr) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] === false) {
                        return true;
                    }
                }
                return false;
            };
            return this._fetch().then(function (data) {
                if (data === null)
                    return;
                Promise.all([
                    exports.loadStyle(data.style).then(function (arr) {
                        _this.localData = __assign({}, data);
                        return !haveFlase(arr);
                    }),
                    exports.loadScript(data.script).then(function (arr) {
                        window[data.id] = data.state;
                        return !haveFlase(arr);
                    })
                ]).then(function (arr) {
                    _this.installOptions = __assign({}, data);
                    _this.install();
                    if (haveFlase(arr)) {
                        _this.$emit('error');
                    }
                });
            });
        }
    },
    serverPrefetch: function () {
        var _this = this;
        return this._fetch().then(function (data) {
            if (data === null)
                return;
            var context = _this.$root.$options.renderContext;
            if (!context && typeof context !== 'object') {
                throw new TypeError('[remote-view] Need to pass context to the root instance of vue');
            }
            data.automount = false;
            Object.assign(_this.localData, data);
        });
    }
};
exports.default = {
    install: function (_Vue) {
        _Vue.component('remote-view', vue_1.default.extend(exports.RemoteView));
    }
};
