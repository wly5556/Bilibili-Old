/**
 * 本模块负责绘制设置UI
 */
(function () {
    try {
        API.registerSetting({
            key: "settingEntryType",
            svg: '<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.174.086.341.183.501.29.417.278.97.423 1.53.27l1.102-.303c.11-.03.175.016.195.046.219.31.41.641.573.989.014.031.022.11-.059.19l-.815.806c-.411.406-.562.957-.53 1.456a4.588 4.588 0 010 .582c-.032.499.119 1.05.53 1.456l.815.806c.08.08.073.159.059.19a6.494 6.494 0 01-.573.99c-.02.029-.086.074-.195.045l-1.103-.303c-.559-.153-1.112-.008-1.529.27-.16.107-.327.204-.5.29-.449.222-.851.628-.998 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.613 6.613 0 01-1.142 0c-.036-.003-.108-.037-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189a4.502 4.502 0 01-.501-.29c-.417-.278-.97-.423-1.53-.27l-1.102.303c-.11.03-.175-.016-.195-.046a6.492 6.492 0 01-.573-.989c-.014-.031-.022-.11.059-.19l.815-.806c.411-.406.562-.957.53-1.456a4.587 4.587 0 010-.582c.032-.499-.119-1.05-.53-1.456l-.815-.806c-.08-.08-.073-.159-.059-.19a6.44 6.44 0 01.573-.99c.02-.029.086-.075.195-.045l1.103.303c.559.153 1.112.008 1.529-.27.16-.107.327-.204.5-.29.449-.222.851-.628.998-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 0c-.236 0-.47.01-.701.03-.743.065-1.29.615-1.458 1.261l-.29 1.106c-.017.066-.078.158-.211.224a5.994 5.994 0 00-.668.386c-.123.082-.233.09-.3.071L3.27 2.776c-.644-.177-1.392.02-1.82.63a7.977 7.977 0 00-.704 1.217c-.315.675-.111 1.422.363 1.891l.815.806c.05.048.098.147.088.294a6.084 6.084 0 000 .772c.01.147-.038.246-.088.294l-.815.806c-.474.469-.678 1.216-.363 1.891.2.428.436.835.704 1.218.428.609 1.176.806 1.82.63l1.103-.303c.066-.019.176-.011.299.071.213.143.436.272.668.386.133.066.194.158.212.224l.289 1.106c.169.646.715 1.196 1.458 1.26a8.094 8.094 0 001.402 0c.743-.064 1.29-.614 1.458-1.26l.29-1.106c.017-.066.078-.158.211-.224a5.98 5.98 0 00.668-.386c.123-.082.233-.09.3-.071l1.102.302c.644.177 1.392-.02 1.82-.63.268-.382.505-.789.704-1.217.315-.675.111-1.422-.364-1.891l-.814-.806c-.05-.048-.098-.147-.088-.294a6.1 6.1 0 000-.772c-.01-.147.039-.246.088-.294l.814-.806c.475-.469.679-1.216.364-1.891a7.992 7.992 0 00-.704-1.218c-.428-.609-1.176-.806-1.82-.63l-1.103.303c-.066.019-.176.011-.299-.071a5.991 5.991 0 00-.668-.386c-.133-.066-.194-.158-.212-.224L10.16 1.29C9.99.645 9.444.095 8.701.031A8.094 8.094 0 008 0zm1.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11 8a3 3 0 11-6 0 3 3 0 016 0z"></svg>',
            sort: "common",
            type: "switch",
            label: "经典设置入口",
            sub: "贴边隐藏",
            value: false
        })
        // @ts-expect-error 专属变量
        const menu: { [name: string]: Menuitem } = MENU, setting: (ItemPic | ItemSwh | ItemSor | ItemRow | ItemPus | ItemIpt | ItemFie | ItemMut | ToolIcon)[] = SETTING;
        class Ui {
            /**
             * UI顶层
             */
            static box: HTMLDivElement;
            /**
             * 工具栏按钮栏
             */
            static tool: Element;
            /**
             * 分类菜单栏
             */
            static menu: Element;
            /**
             * 设置实际界面
             */
            static item: Element;
            /**
             * 输入框历史缓存
             */
            static history: { [name: string]: string[] };
            /**
             * 设置项表
             */
            static list: { [name: string]: HTMLDivElement } = {};
            constructor() {
                const history: { [name: string]: string[] } = GM.getValue<{ [name: string]: string[] }>("history", {})
                Ui.history = new Proxy(history, {
                    set: (_target, p: string, value) => {
                        history[p] = value;
                        GM.setValue<{ [name: string]: string[] }>("history", history);
                        return true;
                    },
                    get: (_target, p: string) => history[p]
                })
                this.stage();
            }
            /**
             * 设置入口
             */
            async stage() {
                if (document.readyState !== 'complete') {
                    await new Promise(r => window.addEventListener('load', r))
                }
                if (config.settingEntryType) return this.classical();
                const div = API.addElement("div").attachShadow({ mode: "closed" });
                const stage = API.addElement("div", { class: "stage" }, div, `<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.174.086.341.183.501.29.417.278.97.423 1.53.27l1.102-.303c.11-.03.175.016.195.046.219.31.41.641.573.989.014.031.022.11-.059.19l-.815.806c-.411.406-.562.957-.53 1.456a4.588 4.588 0 010 .582c-.032.499.119 1.05.53 1.456l.815.806c.08.08.073.159.059.19a6.494 6.494 0 01-.573.99c-.02.029-.086.074-.195.045l-1.103-.303c-.559-.153-1.112-.008-1.529.27-.16.107-.327.204-.5.29-.449.222-.851.628-.998 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.613 6.613 0 01-1.142 0c-.036-.003-.108-.037-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189a4.502 4.502 0 01-.501-.29c-.417-.278-.97-.423-1.53-.27l-1.102.303c-.11.03-.175-.016-.195-.046a6.492 6.492 0 01-.573-.989c-.014-.031-.022-.11.059-.19l.815-.806c.411-.406.562-.957.53-1.456a4.587 4.587 0 010-.582c.032-.499-.119-1.05-.53-1.456l-.815-.806c-.08-.08-.073-.159-.059-.19a6.44 6.44 0 01.573-.99c.02-.029.086-.075.195-.045l1.103.303c.559.153 1.112.008 1.529-.27.16-.107.327-.204.5-.29.449-.222.851-.628.998-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 0c-.236 0-.47.01-.701.03-.743.065-1.29.615-1.458 1.261l-.29 1.106c-.017.066-.078.158-.211.224a5.994 5.994 0 00-.668.386c-.123.082-.233.09-.3.071L3.27 2.776c-.644-.177-1.392.02-1.82.63a7.977 7.977 0 00-.704 1.217c-.315.675-.111 1.422.363 1.891l.815.806c.05.048.098.147.088.294a6.084 6.084 0 000 .772c.01.147-.038.246-.088.294l-.815.806c-.474.469-.678 1.216-.363 1.891.2.428.436.835.704 1.218.428.609 1.176.806 1.82.63l1.103-.303c.066-.019.176-.011.299.071.213.143.436.272.668.386.133.066.194.158.212.224l.289 1.106c.169.646.715 1.196 1.458 1.26a8.094 8.094 0 001.402 0c.743-.064 1.29-.614 1.458-1.26l.29-1.106c.017-.066.078-.158.211-.224a5.98 5.98 0 00.668-.386c.123-.082.233-.09.3-.071l1.102.302c.644.177 1.392-.02 1.82-.63.268-.382.505-.789.704-1.217.315-.675.111-1.422-.364-1.891l-.814-.806c-.05-.048-.098-.147-.088-.294a6.1 6.1 0 000-.772c-.01-.147.039-.246.088-.294l.814-.806c.475-.469.679-1.216.364-1.891a7.992 7.992 0 00-.704-1.218c-.428-.609-1.176-.806-1.82-.63l-1.103.303c-.066.019-.176.011-.299-.071a5.991 5.991 0 00-.668-.386c-.133-.066-.194-.158-.212-.224L10.16 1.29C9.99.645 9.444.095 8.701.031A8.094 8.094 0 008 0zm1.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11 8a3 3 0 11-6 0 3 3 0 016 0z"></svg>`);
                API.addCss(API.getModule("ui-stage.css"), "", div);
                stage.onclick = () => this.display();
                stage.onmouseover = () => stage.style.opacity = "0.8";
                setTimeout(() => {
                    stage.style.opacity = "0";
                    stage.onmouseout = () => stage.style.opacity = "0"
                }, 2e3);
            }
            /**
             * 经典设置入口
             */
            async classical() {
                const div = API.addElement("div").attachShadow({ mode: "closed" });
                const classical = API.addElement("div", { class: "classical" }, div, `<i></i><span>设置</span>`);
                API.addCss(API.getModule("ui-stage.css"), "", div);
                classical.onclick = () => this.display();
            }
            /**
             * 呈现设置界面
             * @param key 设置项的key，直接滚动到对应设置
             */
            display(key?: string) {
                document.querySelector("#ui-border-box")?.remove();
                Ui.borderBox();
                setting.reduce((s: string[], d: any) => {
                    d.sort && !s.includes(d.sort) && (Ui.menuitem(d.sort), s.push(d.sort));
                    Ui.index(d);
                    return s;
                }, [])
                document.body.appendChild(Ui.box);
                Ui.tool.childNodes.forEach((d, i) => {
                    (i < (Ui.tool.childNodes.length - 1)) && ((<HTMLDivElement>d).style.opacity = "0");
                });
                (<HTMLDivElement>Ui.tool).onmouseover = () => {
                    Ui.tool.childNodes.forEach((d, i) => {
                        (i < (Ui.tool.childNodes.length - 1)) && ((<HTMLDivElement>d).style.opacity = "1");
                    });
                }
                (<HTMLDivElement>Ui.tool).onmouseout = () => {
                    Ui.tool.childNodes.forEach((d, i) => {
                        (i < (Ui.tool.childNodes.length - 1)) && ((<HTMLDivElement>d).style.opacity = "0");
                    });
                }
                key && Reflect.has(Ui.list, key) && Ui.list[key].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            static borderBox() {
                this.box = document.createElement("div");
                this.box.setAttribute("id", "ui-border-box")
                const root = this.box.attachShadow({ mode: "closed" });
                const div = API.addElement("div", { class: "box" }, root, `<div class="tool"></div>
            <div class="content">
                <div class="contain">
                    <div class="menu"></div>
                    <div class="item"></div>
                </div>
            </div>`);
                API.addCss(API.getModule("ui.css"), "", root);
                this.tool = div.children[0];
                this.menu = div.children[1].children[0].children[0];
                this.item = div.children[1].children[0].children[1];
                this.toolIcon({
                    type: "icon",
                    svg: '<svg viewBox="0 0 100 100"><path d="M2 2 L98 98 M 98 2 L2 98Z" stroke-width="10px" stroke="#212121" stroke-linecap="round"></path></svg>',
                    title: "关闭",
                    action: (node) => node.remove()
                })
            }
            /**
             * 添加工具栏按钮
             * @param obj 按钮配置数据
             */
            static toolIcon(obj: ToolIcon) {
                const div = this.icon(obj.svg);
                div.setAttribute("title", obj.title);
                this.tool.insertBefore(div, this.tool.firstChild);
                div.onclick = () => obj.action(this.box);
                return div;
            }
            /**
             * 创建图标节点
             * @param svg 图标 svg 字符串
             * @returns 图标节点
             */
            static icon(svg: string) {
                const div = document.createElement("div");
                const root = div.attachShadow({ mode: "closed" });
                API.addElement("div", { class: "icon" }, root, svg);
                API.addCss(API.getModule("icon.css"), "", root);
                return div;
            }
            /**
             * 添加菜单栏
             * @param key 菜单主键
             */
            static menuitem(key: string) {
                let obj = menu[key];
                const div = API.addElement("div", {}, this.menu)
                const root = div.attachShadow({ mode: "closed" });
                const real = API.addElement("div", { class: "menuitem" }, root);
                API.addCss(API.getModule("ui-menu.css"), "", root);
                obj.svg && real.appendChild(this.icon(obj.svg));
                real.appendChild(document.createTextNode(obj.name))
                div.onclick = () => {
                    let selected = this.menu.querySelector(".selected");
                    let itembox = this.item.querySelector(`.${obj.key}`);
                    selected && selected.removeAttribute("class")
                    itembox && itembox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    div.setAttribute("class", "selected");
                }
            }
            /**
             * 添加菜单组合项
             * @param key 菜单主键
             * @returns 组合框节点，用以添加设计设置项
             */
            static itemContain(key: string) {
                let obj = menu[key];
                let div = this.item.querySelector(`.${obj.key}`);
                if (!div) {
                    div = API.addElement("div", { class: obj.key }, this.item);
                    const root = div.attachShadow({ mode: "open" });
                    API.addElement("div", { class: "contain" }, root, `<div class="header">
                    <h2 class="title">${obj.name}</h2>
                </div>
                <div class="card"></div>`);
                    API.addCss(API.getModule("ui-contain.css"), "", root);
                }
                return <HTMLDivElement>div.shadowRoot.querySelector(".card");
            }
            /**
             * 创建浮动信息，鼠标移动该节点上时显示
             * @param node 浮动信息所属节点
             * @param data 浮动信息内容
             */
            static float(node: HTMLElement, data: string) {
                const div = document.createElement("div");
                const root = div.attachShadow({ mode: "closed" });
                const real = API.addElement("div", { class: "float" }, root, `<div class="arrow"></div><div class="message">${data}</div>`);
                API.addCss(API.getModule("ui-float.css"), "", root);
                node.onmouseover = (ev) => {
                    document.body.appendChild(div);
                    let rect = real.getBoundingClientRect();
                    real.style.left = `${node.getBoundingClientRect().x + ev.offsetX}px`;
                    real.style.top = `${node.getBoundingClientRect().y + ev.offsetY - rect.height}px`;
                    real.style.width = `${Math.sqrt(rect.width * rect.height) * 4 / 3}px`;
                }
                node.onmouseout = () => div.remove();
            }
            /**
             * 设置分类
             * @param obj 设置内容
             * @param node 父节点
             * @returns 设置节点
             */
            static index(obj: ItemPic | ItemSwh | ItemSor | ItemRow | ItemPus | ItemIpt | ItemFie | ItemMut | ToolIcon | ItemCus, node?: Element) {
                let result: HTMLDivElement;
                if (!obj.hidden) switch (obj.type) {
                    case "action": result = this.action(obj, node);
                        break;
                    case "file": result = this.file(obj, node);
                        break;
                    case "input": result = this.input(obj, node);
                        break;
                    case "mutlti": result = this.multi(obj, node);
                        break;
                    case "picture": result = this.picture(obj, node);
                        break;
                    case "row": result = this.row(obj, node);
                        break;
                    case "sort": result = this.sort(obj, node);
                        break;
                    case "switch": result = this.switch(obj, node);
                        break;
                    case "icon": result = this.toolIcon(obj);
                        break;
                    case "custom": result = this.custom(obj);
                }
                return result;
            }
            /**
             * 添加纯图片设置
             * @param obj 设置内容
             * @param node 父节点
             * @returns 设置节点
             */
            static picture(obj: ItemPic, node?: Element) {
                node = node || this.itemContain(obj.sort);
                const div = document.createElement("div");
                const root = div.attachShadow({ mode: "closed" });
                const real = API.addElement("div", { class: "contain" }, root, `<picture><img src="${obj.src}"></picture>`);
                API.addCss(API.getModule("ui-picture.css"), "", root);
                node && node.appendChild(div);
                obj.callback && new Promise(r => obj.callback.call(real));
                return div;
            }
            /**
             * 添加开关设置
             * @param obj 设置内容
             * @param node 父节点
             * @returns 设置节点
             */
            static switch(obj: ItemSwh, node?: Element) {
                node = node || this.itemContain(obj.sort);
                const div = document.createElement("div");
                const root = div.attachShadow({ mode: "closed" });
                const real = API.addElement("div", { class: "contain" }, root);
                API.addCss(API.getCss("ui-item.css"), "", root);
                Reflect.set(this.list, obj.key, real);
                obj.svg && real.appendChild(this.icon(obj.svg));
                const label = API.addElement("div", { class: "label" }, real, obj.label);
                real.appendChild(API.element.switch(function (v) {
                    config[obj.key] = v;
                    obj.action && obj.action.call(this, config[obj.key]);
                }, config[obj.key]))
                obj.sub && (label.innerHTML = `${obj.label}<div class="sub">${obj.sub}</div>`);
                obj.float && this.float(real, obj.float);
                node && node.appendChild(div);
                obj.callback && new Promise(r => obj.callback.call(real));
                return div;
            }
            /**
             * 添加下拉设置
             * @param obj 设置内容
             * @param node 父节点
             * @returns 设置节点
             */
            static row(obj: ItemRow, node?: Element) {
                node = node || this.itemContain(obj.sort);
                let div = document.createElement("div");
                const root = div.attachShadow({ mode: "closed" });
                const real = API.addElement("div", { class: "contain" }, root);
                Reflect.set(this.list, obj.key, real);
                API.addCss(API.getCss("ui-item.css"), "", root);
                obj.svg && real.appendChild(this.icon(obj.svg));
                const label = API.addElement("div", { class: "label" }, real, obj.label);
                real.appendChild(API.element.select(obj.list, function (v) {
                    config[obj.key] = v;
                    (<any>config)[obj.key] = v;
                    obj.action && obj.action.call(this, v);
                }, config[obj.key]))
                obj.sub && API.addElement("div", { class: "sub" }, label, obj.sub);
                obj.float && this.float(real, obj.float);
                node && node.appendChild(div);
                obj.callback && new Promise(r => obj.callback.call(real));
                return div;
            }
            /**
             * 添加归档设置
             * @param obj 设置内容
             * @param node 父节点
             * @returns 设置节点
             */
            static sort(obj: ItemSor, node?: Element) {
                node = node || this.itemContain(obj.sort);
                let div = document.createElement("div");
                let sec = document.createElement("div");
                let flag: boolean = false;
                let item: HTMLDivElement[];
                const root = div.attachShadow({ mode: "closed" });
                const real = API.addElement("div", { class: "contain" }, root);
                Reflect.set(this.list, obj.key, real);
                API.addCss(API.getModule("ui-sort-head.css"), "", root);
                const secroot = sec.attachShadow({ mode: "closed" });
                const secreal = API.addElement("div", { class: "contain" }, secroot);
                API.addCss(API.getModule("ui-sort-body.css"), "", secroot);
                obj.svg && real.appendChild(this.icon(obj.svg));
                const label = API.addElement("div", { class: "label" }, real, obj.label);
                const value = API.addElement("div", { class: "anchor" }, real);
                value.appendChild(this.icon(`<svg viewBox="0 0 24 24"><g><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></g></svg>`))
                obj.sub && (label.innerHTML = `${obj.label}<div class="sub">${obj.sub}</div>`);
                obj.float && this.float(real, obj.float);
                node && node.appendChild(div) && node.appendChild(sec);
                obj.callback && new Promise(r => obj.callback.call(real));
                item = obj.list.reduce((s: HTMLDivElement[], d) => {
                    let temp = this.index(d, secreal);
                    temp.style.display = "none";
                    s.push(temp);
                    return s;
                }, []);
                value.onclick = () => {
                    flag = !flag;
                    flag ? value.setAttribute("checked", "checked") : value.removeAttribute("checked");
                    flag ? item.forEach(d => d.style.display = "block") : item.forEach(d => d.style.display = "none")
                }
                return div;
            }
            /**
             * 添加按钮菜单
             * @param obj 设置内容
             * @param node 父节点
             * @returns 设置节点
             */
            static action(obj: ItemPus, node?: Element) {
                node = node || this.itemContain(obj.sort);
                let div = document.createElement("div");
                let disabled = obj.hasOwnProperty("disabled") ? obj.disabled : 3;
                const root = div.attachShadow({ mode: "closed" });
                const real = API.addElement("div", { class: "contain" }, root);
                Reflect.set(this.list, obj.key, real);
                API.addCss(API.getModule("ui-item.css"), "", root);
                obj.svg && real.appendChild(this.icon(obj.svg));
                const label = API.addElement("div", { class: "label" }, real, obj.label);
                real.appendChild(API.element.button(function () {
                    obj.action.call(this);
                }, obj.title, disabled));
                obj.sub && (label.innerHTML = `${obj.label}<div class="sub">${obj.sub}</div>`);
                obj.float && this.float(real, obj.float);
                node && node.appendChild(div);
                obj.callback && new Promise(r => obj.callback.call(real));
                return div;
            }
            /**
             * 添加输入框设置
             * @param obj 设置内容
             * @param node 父节点
             * @returns 设置节点
             */
            static input(obj: ItemIpt, node?: Element) {
                node = node || this.itemContain(obj.sort);
                let div = document.createElement("div");
                let history: string[] = [];
                let disabled = obj.hasOwnProperty("disabled") ? obj.disabled : 3;
                const root = div.attachShadow({ mode: "closed" });
                const real = API.addElement("div", { class: "contain" }, root);
                Reflect.set(this.list, obj.key, real);
                API.addCss(API.getModule("ui-input.css"), "", root);
                obj.svg && real.appendChild(this.icon(obj.svg));
                API.addElement("div", { style: "padding-inline-start: 12px;flex: 1;flex-basis: 0.000000001px;padding-block-end: 12px;padding-block-start: 12px;" }, real, obj.label);
                const value = API.addElement("div", { class: "textbox" }, real);
                obj.key ? (API.addElement("input", { list: `list-${obj.key}` }, value),
                    API.addElement("datalist", { id: `list-${obj.key}` }, value),
                    value.appendChild(this.icon(`<svg viewBox="0 0 24 24"><g><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"></path></g></svg>`)))
                    : API.addElement("input", {}, value);
                obj.title && API.addElement("div", { class: "button" }, value, obj.title);
                (history = this.history[obj.key] || [],
                    history.reduce((s, d) => {
                        API.addElement("option", { value: d || "" }, s);
                        return s;
                    }, value.children[1]),
                    (<HTMLDivElement>value.children[2]).setAttribute("style", "display: none;cursor: pointer;pointer-events: auto;position: absolute;right: 100%;background-color: white;"));
                obj.float && this.float(real, obj.float);
                node && node.appendChild(div);
                obj.callback && new Promise(r => obj.callback.call(real));
                let input = <HTMLInputElement>value.children[0];
                let clear = <HTMLDivElement>value.children[2];
                obj.hasOwnProperty("value") && (input.value = <string>config[obj.key]);
                Object.entries(obj.input).forEach(d => { input.setAttribute(d[0], d[1]) });
                value.onmouseover = () => history.length > 0 && (clear && (clear.style.display = "block"));
                value.onmouseout = () => { clear && (clear.style.display = "none"); }
                clear && (clear.onclick = () => {
                    history = this.history[obj.key] = [];
                    real.querySelectorAll("option").forEach(d => d.remove());
                    clear.style.display = "none";
                });
                obj.title ? ((real.querySelector(".button") as HTMLDivElement).onclick = () => {
                    if (!input.value || ((<any>config)[obj.key] == input.value)) return;
                    if (obj.pattern && !obj.pattern.test(input.value)) return toast.warning("非法输入！", `正则限制：${obj.pattern.toString()}`);
                    (<HTMLDivElement>real.querySelector(".button")).setAttribute("disabled", "disabled");
                    disabled && setTimeout(() => (<HTMLDivElement>real.querySelector(".button")).removeAttribute("disabled"), disabled * 1000);
                    obj.hasOwnProperty("value") && (config[obj.key] = input.value, (<any>config)[obj.key] = input.value);
                    !history.includes(input.value) && history.push(input.value) && (this.history[obj.key] = history);
                    obj.action && obj.action.call(real, input.value);
                }) : (input.onchange = () => {
                    if (obj.pattern && !obj.pattern.test(input.value)) return toast.warning("非法输入！", `正则限制：${obj.pattern.toString()}`);
                    obj.hasOwnProperty("value") && (config[obj.key] = input.value, (<any>config)[obj.key] = input.value);
                    !history.includes(input.value) && history.push(input.value) && (this.history[obj.key] = history);
                    obj.action && obj.action.call(real, input.value);
                })
                return div;
            }
            /**
             * 添加文件选择设置
             * @param obj 设置内容
             * @param node 父节点
             * @returns 设置节点
             */
            static file(obj: ItemFie, node?: Element) {
                node = node || this.itemContain(obj.sort);
                let div = document.createElement("div");
                const root = div.attachShadow({ mode: "closed" });
                const real = API.addElement("div", { class: "contain" }, root);
                Reflect.set(this.list, obj.key, real);
                API.addCss(API.getModule("ui-file.css"), "", root);
                obj.svg && real.appendChild(this.icon(obj.svg));
                const label = API.addElement("div", { class: "label" }, real, obj.label);
                const value = API.addElement("div", { class: "button" }, real, obj.title);
                const input = <HTMLInputElement>API.addElement("input", { type: "file", style: "width: 0;" }, real);
                obj.sub && (label.innerHTML = `${obj.label}<div class="sub">${obj.sub}</div>`);
                obj.accept && (input.accept = obj.accept.join(","));
                obj.multiple && (input.multiple = true);
                obj.float && this.float(real, obj.float);
                node && node.appendChild(div);
                obj.callback && new Promise(r => obj.callback.call(real));
                value.onclick = () => input.click();
                input.onclick = () => input.value = "";
                input.onchange = () => input.files && obj.action.call(real, input.files);
                return div;
            }
            /**
             * 添加复选设置
             * @param obj 设置内容
             * @param node 父节点
             * @returns 设置节点
             */
            static multi(obj: ItemMut, node?: Element) {
                node = node || this.itemContain(obj.sort);
                let div = document.createElement("div");
                const root = div.attachShadow({ mode: "closed" });
                const real = API.addElement("div", { class: "contain" }, root);
                Reflect.set(this.list, obj.key, real);
                API.addCss(API.getModule("ui-item.css"), "", root);
                obj.svg && real.appendChild(this.icon(obj.svg));
                const label = API.addElement("div", { class: "label" }, real, obj.label);
                real.appendChild(API.element.checkbox(obj.list, function (v) {
                    config[obj.key] = v;
                    obj.action && obj.action.call(this, v);
                }, config[obj.key]));
                obj.sub && (label.innerHTML = `${obj.label}<div class="sub">${obj.sub}</div>`);
                obj.float && this.float(real, obj.float);
                node && node.appendChild(div);
                obj.callback && new Promise(r => obj.callback.call(real));
                return div;
            }
            /**
             * 添加自定义设置
             * @param obj 设置内容
             * @param node 父节点
             * @returns 设置节点
             */
            static custom(obj: ItemCus, node?: Element) {
                node = node || this.itemContain(obj.sort);
                let div = document.createElement("div");
                const root = div.attachShadow({ mode: "open" });
                const real = API.addElement("div", { class: "contain" }, root);
                const table: { [name: string]: HTMLElement } = {};
                Reflect.set(this.list, obj.key, real);
                API.addCss(API.getModule("ui-item.css"), "", root);
                obj.svg && real.appendChild(table.svg = this.icon(obj.svg));
                table.label = API.addElement("div", { class: "label" }, real, obj.label);
                table.value = API.addElement("div", {}, real, obj.custom);
                obj.sub && (table.label.innerHTML = `${obj.label}<div class="sub">${obj.sub}</div>`);
                obj.float && this.float(real, obj.float);
                node && node.appendChild(div);
                obj.callback && new Promise(r => obj.callback.call(real));
                obj.flesh && obj.flesh.call(real, new Proxy(obj, {
                    set: (t, p, v) => {
                        Reflect.set(obj, p, v);
                        switch (p) {
                            case "svg": table.temp = this.icon(v);
                                table.svg.replaceWith(table.temp);
                                table.svg = table.temp;
                                break;
                            case "label": table.label = API.addElement("div", { class: "label" }, real, v, false, table.label);
                                break;
                            case "custom": table.value = API.addElement("div", {}, real, v, false, table.value);
                                break;
                            case "sub": table.label.innerHTML = `${obj.label}<div class="sub">${v}</div>`;
                                break;
                        }
                        return true;
                    }
                }))
                return div;
            }
        }
        API.importModule("setting.js");
        const ui = new Ui();
        Reflect.set(API, "displaySetting", (key?: string) => ui.display(key));
        GM.getValue("modules") && API.alertMessage(`脚本更新残留后残留了大量废弃数据在您本地存储中，造成了额外的性能消耗！</br>是否立即执行清洁安装？</br><strong>将删除本脚本所有存储痕迹，您可以先备份设置再执行本操作！</strong>`).then(d => {
            if (d) {
                const arr = GM.listValues();
                arr.forEach(d => GM.deleteValue(d));
                toast.success("清洁完成！");
            } else toast.warning("取消操作，将在下次刷新时重新提示！")
        })
        API.importModule("notice.js"); // 脚本公告
    } catch (e) { toast.error("ui.js", e) }
})();
declare namespace API {
    /**
     * 弹出设置菜单  
     * 指定key值将直接滚动到对应的设置项
     * @param key 设置项的key
     */
    function displaySetting(key?: string): void;
}
declare namespace config {
    /**
     * 通用：设置入口
     */
    let settingEntryType: boolean;
}