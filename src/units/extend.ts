/**
 * 本模块负责拓展一些小工具，这些工具不便写在主模块中
 */
(function () {
    try {
        function getCookies() {
            return document.cookie.split('; ').reduce((s: { [name: string]: string }, d) => {
                let key = d.split('=')[0];
                let val = d.split('=')[1];
                s[key] = val;
                return s;
            }, {});
        }
        API.getCookies = () => getCookies();
        async function loginExit(referer?: string) {
            if (!API.uid) return toast.warning("本就未登录，无法退出登录！");
            toast.warning("正在退出登录...");
            let data = API.jsonCheck(await xhr({
                url: "https://passport.bilibili.com/login/exit/v2",
                data: `biliCSRF=${API.getCookies().bili_jct}&gourl=${encodeURIComponent(location.href)}`,
                method: "POST",
                credentials: true
            }))
            if (data.status) {
                toast.success("退出登录！");
                if (referer) return location.replace(referer);
                setTimeout(() => location.reload(), 1000);
            }
        }
        API.loginExit = (referer?: string) => loginExit(referer);
        function jsonCheck(data: String | JSON) {
            let result: { [name: string]: unknown } = typeof data === "string" ? JSON.parse(data) : data;
            if ("code" in result && result.code !== 0) {
                let msg = result.msg || result.message || "";
                throw [result.code, msg];
            }
            return result;
        }
        API.jsonCheck = (data: String | JSON) => jsonCheck(data);
        function restorePlayerSetting() {
            let bilibili_player_settings = localStorage.getItem("bilibili_player_settings");
            let settings_copy = GM.getValue<{ [name: string]: any }>("bilibili_player_settings", {});
            if (bilibili_player_settings) {
                let settings = <{ [name: string]: any }>JSON.parse(bilibili_player_settings);
                if (settings?.video_status?.autopart !== "") GM.setValue<{ [name: string]: any }>("bilibili_player_settings", settings);
                else if (settings_copy) localStorage.setItem("bilibili_player_settings", JSON.stringify(settings_copy));
            } else if (settings_copy) {
                localStorage.setItem("bilibili_player_settings", JSON.stringify(settings_copy));
            }
        }
        API.restorePlayerSetting = () => restorePlayerSetting();
        function biliQuickLogin() {
            (<any>window).biliQuickLogin ? (<any>window).biliQuickLogin() : (<any>window).$ ? (<any>window).$.getScript("//static.hdslb.com/account/bili_quick_login.js", () => (<any>window).biliQuickLogin()) : false;
        }
        API.biliQuickLogin = () => biliQuickLogin();
        function getTotalTop(node: HTMLElement) {
            var sum = 0;
            do {
                sum += node.offsetTop;
                node = <HTMLElement>node.offsetParent;
            }
            while (node);
            return sum;
        }
        API.getTotalTop = (node: HTMLElement) => getTotalTop(node);
        async function saveAs(content: BufferSource | Blob | string, fileName: string, contentType: string = "text/plain") {
            const a = document.createElement("a");
            const file = new Blob([content], { type: contentType });
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();
        }
        function getUrlValue(name: string) {
            const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            const r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURIComponent(r[2]); return null;
        }
        API.getUrlValue = (name: string) => getUrlValue(name);
        API.saveAs = (content: BufferSource | Blob | string, fileName: string, contentType?: string) => saveAs(content, fileName, contentType);
        function readAs(file: File, type: "ArrayBuffer" | "DataURL" | "string" = "string", encoding?: string) {
            return new Promise((resolve: (value: ArrayBuffer | string) => void, reject) => {
                const reader = new FileReader();
                switch (type) {
                    case "ArrayBuffer": reader.readAsArrayBuffer(file);
                        break;
                    case "DataURL": reader.readAsDataURL(file);
                        break;
                    case "string": reader.readAsText(file, encoding || 'utf-8');
                        break;
                }
                reader.onload = () => resolve(reader.result);
                reader.onerror = e => reject(e);
            })
        }
        (<any>API.readAs) = (file: File, type?: "ArrayBuffer" | "DataURL" | "string", encoding?: string) => readAs(file, type, encoding);
        const aids: { [name: string]: any } = {};
        async function getAidInfo(aid: number) {
            if (!aids[aid]) {
                const data = await xhr({
                    url: `https://api.bilibili.com/x/web-interface/view/detail?aid=${aid}`,
                    responseType: "json",
                    credentials: true
                })
                aids[aid] = data.data;
            }
            return aids[aid];
        }
        API.getAidInfo = (aid: number) => getAidInfo(aid);
        function strSize(str: string) {
            let size = 0;
            for (let i = 0; i < str.length; i++) {
                const code = str.charCodeAt(i);
                if (code <= 0x007f) size++;
                else if (code <= 0x07ff) size += 2;
                else if (code <= 0xffff) size += 3;
                else size += 4;
            }
            return size;
        }
        API.strSize = (str: string) => strSize(str);
        function intervalFormat(time: number) {
            time >= 1e11 && (time = Math.floor(time / 1e3));
            const now = Math.floor((new Date).getTime() / 1e3);
            let t: any = new Date;
            if (t.setHours(0), t.setMinutes(0), t.setSeconds(0), (t = Math.floor(t.getTime() / 1e3)) < time && 0 <= now - time) {
                if (now - time <= 50) {
                    var r = 10 * Math.floor((now - time) % 60 / 10);
                    return (10 < time ? r : 10) + "秒前"
                }
                return now - time < 3600 ? Math.floor((now - time) / 60) + "分钟前" : Math.floor((now - time) / 3600) + "小时前"
            }
            return API.timeFormat(time * 1e3, true);
        }
        API.intervalFormat = (time: number) => intervalFormat(time);
        async function addCss(txt: string, id?: string, parrent?: Node) {
            if (!parrent && !document.head) {
                await new Promise(r => API.runWhile(() => document.body, r));
            }
            parrent = parrent || document.head;
            const style = document.createElement("style");
            style.setAttribute("type", "text/css");
            id && !(<HTMLElement>parrent).querySelector(`#${id}`) && style.setAttribute("id", id);
            style.appendChild(document.createTextNode(txt));
            parrent.appendChild(style);
        }
        API.addCss = (txt: string, id?: string, parrent?: Node) => addCss(txt, id, parrent);
        function addElement<T extends keyof HTMLElementTagNameMap>(tag: T, attribute?: { [name: string]: string }, parrent?: Node, innerHTML?: string, top?: boolean, replaced?: Element): HTMLElementTagNameMap[T] {
            let element = document.createElement(tag);
            attribute && (Object.entries(attribute).forEach(d => element.setAttribute(d[0], d[1])));
            parrent = parrent || document.body;
            innerHTML && (element.innerHTML = innerHTML);
            replaced ? replaced.replaceWith(element) : top ? parrent.insertBefore(element, parrent.firstChild) : parrent.appendChild(element);
            return element;
        }
        API.addElement = <T extends keyof HTMLElementTagNameMap>(tag: T, attribute?: { [name: string]: string }, parrent?: Node, innerHTML?: string, top?: boolean, replaced?: Element) => addElement(tag, attribute, parrent, innerHTML, top, replaced);
        function runWhile(check: Function, callback: Function, delay: number = 100, stop: number = 180) {
            let timer = setInterval(() => {
                if (check()) {
                    clearInterval(timer);
                    callback();
                }
            }, delay);
            stop && setTimeout(() => clearInterval(timer), stop * 1000)
        }
        API.runWhile = (check: Function, callback: Function, delay: number = 100, stop: number = 180) => runWhile(check, callback, delay, stop);
        function bofqiMessage(msg?: string | [string?, string?, string?], time = 3, callback?: () => void, replace = true) {
            let node = document.querySelector(".bilibili-player-video-toast-bottom");
            if (!node) {
                if (msg) {
                    if (Array.isArray(msg)) return debug.log(...msg);
                    return debug.log(msg)
                }
                return;
            }
            if (!msg) node.childNodes.forEach(d => d.remove());
            const table = document.querySelector(".bilibili-player-video-toast-item.bilibili-player-video-toast-pay") || document.createElement("div");
            table.setAttribute("class", "bilibili-player-video-toast-item bilibili-player-video-toast-pay");
            const ele = document.createElement("div");
            ele.setAttribute("class", "bilibili-player-video-toast-item-text");
            table.appendChild(ele);
            msg = Array.isArray(msg) ? msg : [msg];
            if (!msg[0]) return;
            replace && node.childNodes.forEach(d => d.remove());
            ele.innerHTML = <string>msg.reduce((s, d, i) => {
                if (d) {
                    switch (i) {
                        case 0: s += `<span class="video-float-hint-text">${d}</span>`;
                            break;
                        case 1: s += `<span class="video-float-hint-btn hint-red">${d}</span>`;
                            break;
                        case 2: s += `<span class="video-float-hint-btn">${d}</span>`;
                            break;
                    }
                }
                return s;
            }, '');
            node.appendChild(table);
            callback && (ele.style.cursor = "pointer") && (ele.onclick = () => callback());
            (time !== 0) && setTimeout(() => {
                ele.remove();
                !table.children[0] && table.remove();
            }, time * 1000);
        }
        API.bofqiMessage = (msg?: string | [string?, string?, string?], time?: number, callback?: () => void, replace?: boolean) => bofqiMessage(msg, time, callback, replace);
        async function alertMessage(text: string, title: string = API.Name) {
            return new Promise((r: (value: boolean) => void) => {
                const root = API.addElement("div")
                const div = root.attachShadow({ mode: "closed" });
                const table = API.addElement("div", { class: "table" }, div, `
            <div class="title">${title}</div>
            <div class="text">${text}</div>
            <div class="act">
                <div class="button">确认</div>
                <div class="button">取消</div>
                </div>
            `);
                API.addCss(API.getCss("alert.css", "button.css"), '', div);
                table.querySelectorAll(".button").forEach((d: HTMLElement, i) => {
                    i ? (d.onclick = () => { root.remove(), r(false) }) : (d.onclick = () => (root.remove(), r(true)))
                })
            })
        }
        API.alertMessage = (text: string, title: string) => alertMessage(text, title);
        /**
         * 重写网页框架
         * @param html 网页模板
         */
        function rewriteHTML(html: string) {
            API.getModule("bug.json").forEach((d: string) => {
                window[d] && Reflect.set(window, d, undefined);
            });
            // document.write方法的使用会使高级API异常，解决办法是仍旧使用沙盒环境中的document对象上的方法
            (<any>API).document.open();
            (<any>API).document.write(html);
            (<any>API).document.close();
            config.rewriteMethod == "异步" && API.importModule("vector.js"); // 重写后页面正常引导
        }
        API.rewriteHTML = (html: string) => rewriteHTML(html);
    } catch (e) { toast.error("extend.js", e) }
})();
/**
 * 模块间的顶层变量，类似于`window`
 */
declare namespace API {
    /**
     * 脚本名字
     */
    let Name: string;
    /**
     * 脚本版本
     */
    let Virsion: string;
    /**
     * 脚本管理器名字
     */
    let Handler: string;
    /**
     * 获取当前用户cookies
     */
    function getCookies(): { [name: string]: string };
    /**
     * 代理退出登录功能
     * @param referer 退出后跳转的页面URL
     */
    function loginExit(referer?: string): Promise<void>;
    /**
     * 检查B站json接口返回值并格式化为json  
     * 对于code异常将直接抛出错误！
     * @param data 返回值字符串或者json
     */
    function jsonCheck(data: String | JSON): { [name: string]: any };
    /**
     * 修复被新版播放器数据破坏的旧版播放器设置数据
     */
    function restorePlayerSetting(): void;
    /**
     * B站快捷登录
     */
    function biliQuickLogin(): void;
    /**
     * 计算节点绝对高度，相对于文档
     * @param node 文档垂直偏移：/px
     */
    function getTotalTop(node: HTMLElement): number;
    /**
     * 保存为本地文件
     * @param content 文档内容，JSON请先转化为字符串类型
     * @param fileName 保存为文件名，需包含拓展名
     * @param contentType 文档内容的MIME类型，默认为text/plain
     */
    function saveAs(content: BufferSource | Blob | string, fileName: string, contentType?: string): Promise<void>;
    /**
     * 读取本地文件
     * @param file 本地文件File，来自type="file"的input标签，`input.files`中的元素
     * @param type 将file以特定的格式编码，默认为string，即字符串形式
     * @param encoding 字符串的编码格式，默认为utf-8，仅在type="string"时有意义
     * @returns Promise托管的文件内容
     */
    function readAs(file: File): Promise<string>;
    function readAs(file: File, type: "DataURL"): Promise<string>;
    function readAs(file: File, type: "string", encoding?: string): Promise<string>;
    function readAs(file: File, type: "ArrayBuffer"): Promise<ArrayBuffer>;
    /**
     * 获取aid的信息，无效aid除外
     * @param aid aid
     */
    function getAidInfo(aid: number): Promise<any>;
    /**
     * 从url中提取指定参数
     * @param name 参数名
     * @returns 参数值，不存在返回null
     */
    function getUrlValue(name: string): string;
    /**
     * 求utf-8字符串字节数
     * @param str utf-8字符串（js默认字符串格式）
     * @returns 字节数
     */
    function strSize(str: string): number;
    /**
     * 格式化时间间隔，返回过去了多长时间  
     * timeFormat的再封装
     * @param time 10/13位的时间戳
     * @returns 过去了多长时间，当时间间隔超过一天时，直接返回timeFormat带年月日的结果
     */
    function intervalFormat(time: number): string;
    /**
     * 添加css样式
     * @param txt css文本
     * @param id 样式ID，用于唯一标记
     * @param parrent 添加到的父节点，默认为head
     */
    function addCss(txt: string, id?: string, parrent?: Node): Promise<void>;
    /**
     * 创建HTML节点
     * @param tag 节点名称
     * @param attribute 节点属性对象
     * @param parrent 添加到的父节点，默认为body
     * @param innerHTML 节点的innerHTML
     * @param top 是否在父节点中置顶
     * @param replaced 替换节点而不是添加，被替换的节点，将忽略父节点相关参数
     */
    function addElement<T extends keyof HTMLElementTagNameMap>(tag: T, attribute?: { [name: string]: string }, parrent?: Node, innerHTML?: string, top?: boolean, replaced?: Element): HTMLElementTagNameMap[T];
    /**
     * 添加条件回调，条件为真时执行回调函数，用于检测函数运行时机  
     * @param check 一个返回布尔值的函数，用于轮询，当函数返回值为真时执行回调函数
     * @param callback 待执行的回调函数
     * @param delay 轮询间隔：/ms，默认100ms
     * @param stop 轮询最大延时：/ms，多长时间后终止轮询，不做无谓的等待，默认180ms，即3分钟。为0时永不终止直到为真。
     */
    function runWhile(check: Function, callback: Function, delay?: number, stop?: number): void;
    /**
     * 播放器通知，播放器不存在将转送到控制台
     * @param msg 消息字符串或数组，数组时顺序分别为普通、红色、黄色消息，可按位次置空取所需颜色。本值不存在将作为“屏显”使用。
     * @param time 消息时长：/s，默认为3，为0表示永久消息
     * @param callback 点击消息执行的回调函数
     * @param replace 替代已有消息，默认为真，即同时只显示一条消息
     */
    function bofqiMessage(msg?: string | [string?, string?, string?], time?: number, callback?: () => void, replace?: boolean): void;
    /**
     * 弹出提示框  
     * 仿造alert制作的提示框，但不具备中断页面的能力，异步返回用户点击的按钮布尔值
     * @param title 提示标题，默认为脚本名称
     * @param text 提示内容
     * @returns Promise代理的布尔值，取决于用户的点击的按钮
     */
    function alertMessage(text: string, title?: string): Promise<boolean>;
    /**
     * 载入模块
     * @param name 模块名字
     * @param args 传递给对方的全局变量：格式{变量名：变量值}
     * @param force 是否强制载入，一般模块只会载入一次，需要二次载入请将本值设为真
     */
    function importModule(name?: string | symbol, args?: { [key: string]: any; }, force?: boolean): string[];
    /**
     * 获取模块内容
     * @param name 模块名字
     * @returns json直接返回格式化对象，其他返回字符串
     */
    function getModule(name: string): any;
    /**
     * 重写网页框架
     * @param html 网页模板
     */
    function rewriteHTML(html: string): void;
}