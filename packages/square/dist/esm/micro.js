import Tms from '@fmfe/tms.js';
import Vue from 'vue';
import { install } from './install';
export const log = (log) => {
    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log(`[micro] ${log}`);
    }
};
const getType = (payload) => {
    return Object.prototype.toString
        .call(payload)
        .replace(/^(.*?) |]$/g, '')
        .toLowerCase();
};
class MicroBase {
    constructor() {
        this.rid = 0;
        this.useCount = 0;
        // 需要放到最后处理， 否则vue不会进行属性劫持
        this.vm = new Vue({
            data: {
                $$this: this
            }
        });
        Object.defineProperty(this, 'vm', {
            enumerable: false
        });
        Object.defineProperty(this, 'rid', {
            enumerable: false
        });
        Object.defineProperty(this, 'useCount', {
            enumerable: false
        });
        log('Create examples');
    }
    static setVue(_Vue) {
        if (this._Vue)
            return;
        this._Vue = _Vue;
    }
    static getVue() {
        const _Vue = this._Vue;
        if (!_Vue) {
            throw new Error('Please install Vue.use(Micro);');
        }
        return _Vue;
    }
    addUse() {
        this.useCount++;
    }
    reduceUse() {
        this.useCount--;
    }
    get isUse() {
        return this.useCount > 0;
    }
    /**
     * Registration module
     */
    register(name, v) {
        const rid = `${name}_${++this.rid}`;
        Micro.getVue().set(this, rid, v);
        log(`Registration module ${rid}`);
        return rid;
    }
    /**
     * Get module
     */
    getModule(rid) {
        return this[rid];
    }
    /**
     * Remove module
     */
    unregister(name, rid) {
        Micro.getVue().delete(this, rid);
        log(`Remove module ${rid}`);
    }
    /**
     * Destroy instance
     */
    destroy() {
        log('Destroy instance');
        this.vm && this.vm.$destroy();
        this._vm = null;
    }
}
MicroBase.install = install;
MicroBase._Vue = null;
const deepRecursionTms = (target, rid, fn) => {
    if (typeof target !== 'object' || Array.isArray(target))
        return;
    if (target instanceof Tms) {
        fn(target, rid.join('.'));
        Object.keys(target).forEach((k) => {
            deepRecursionTms(target[k], [...rid, k], fn);
        });
    }
};
export function command({ micro, position, payloads, isShowError }) {
    const paths = position.split('.');
    const len = paths.length - 1;
    let current = micro;
    for (let i = 0; i < len; i++) {
        const name = paths[i];
        if (current[name] && current[name] instanceof Tms) {
            current = current[name];
        }
        else if (isShowError) {
            throw new Error(`${position} 的 ${name} class 不存在`);
        }
    }
    const fnName = paths[paths.length - 1];
    const fn = current[fnName];
    if (typeof fn === 'function') {
        return fn.call(current, ...payloads);
    }
    else if (isShowError) {
        throw new Error(`${position} 的 ${fnName} 方法不存在`);
    }
}
export class Micro extends MicroBase {
    constructor(options) {
        super();
        this.debug = process.env.NODE_ENV !== 'production';
        this.subs = [];
        this.commits = [];
        Object.defineProperty(this, 'debug', {
            enumerable: false
        });
        Object.defineProperty(this, 'subs', {
            enumerable: false
        });
        Object.defineProperty(this, 'commits', {
            enumerable: false
        });
        if (options && options.commits) {
            this.commits = options.commits;
        }
    }
    register(name, installModule) {
        const rid = super.register(name, installModule);
        deepRecursionTms(installModule, [rid], (target, path) => {
            target.dep[`_micro_observe_${rid}`] = (event) => {
                const commit = {
                    position: `${path}.${event.type}`,
                    payloads: event.payloads
                };
                this.subs.forEach((fn) => fn(commit));
                if (this.debug) {
                    // eslint-disable-next-line no-console
                    console.log(`position   ${commit.position}(payload: ${getType(event.payloads[0])});`, '\n\rpayloads   ', typeof event.payload === 'object'
                        ? JSON.parse(JSON.stringify(event.payloads))
                        : event.payloads);
                }
            };
            log(`订阅 Tms ${path}`);
            target.dep.addSub(target.dep[`_micro_observe_${rid}`]);
        });
        // 还原状态
        const { commits } = this;
        if (commits.length) {
            const re = new RegExp(`^${rid}`);
            this.commits = commits.filter((event) => {
                const isOk = re.test(event.position);
                if (isOk) {
                    this.command({
                        position: event.position.replace(/^[^.]+/, rid + '.'),
                        payloads: event.payloads
                    });
                }
                return !isOk;
            });
        }
        return rid;
    }
    unregister(name, rid) {
        const unModule = this.getModule(rid);
        super.unregister(name, rid);
        deepRecursionTms(unModule, [name], (target, path) => {
            target.dep.removeSub(target.dep[`_micro_observe_${rid}`]);
            log(`取消订阅 Tms ${path}`);
            // 释放内存
            target.dep[`_micro_observe_${rid}`] = null;
        });
    }
    subscribe(fn) {
        this.subs.push(fn);
    }
    unsubscribe(fn) {
        const index = this.subs.lastIndexOf(fn);
        if (index > -1) {
            this.subs.splice(index, 1);
        }
    }
    /**
     * 只有在服务端才应该调用这个方法
     */
    createServerCommit() {
        const commits = [];
        this.subscribe((commit) => {
            if (/\.\$\$[^$]/.test(commit.position))
                return;
            commits.push(commit);
        });
        return commits;
    }
    /**
     * 执行某个命令
     */
    command(options) {
        return command({
            ...options,
            micro: this,
            isShowError: false
        });
    }
}
