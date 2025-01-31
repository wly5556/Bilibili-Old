/**
 * 本模块负责恢复翻页评论区
 */
(function () {
    try {
        config.trusteeship && API.scriptIntercept(["comment.min.js"], "https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/dist/comment.min.js");
        class ReplyList {
            script = GM.getResourceText(config.oldReplySort ? "comment.min.js" : "comment.js");
            init() {
                if (!this.script) return debug.error("replyList.js", "getResourceText failed！");
                // 拦截评论脚本
                if ((<any>window).bbComment) return this.cover(); // 评论已载入直接覆盖
                // 监听评论脚本载入并覆盖
                Object.defineProperty(window, "bbComment", {
                    set: () => { this.cover() },
                    get: () => undefined,
                    configurable: true
                })
            }
            cover() {
                delete (<any>window).bbComment; // 取消拦截
                new Function(this.script)(); // 载入旧版脚本
                API.addElement("link", { href: "//static.hdslb.com/phoenix/dist/css/comment.min.css", rel: "stylesheet" }, document.head);
                API.addCss(API.getCss("comment.css"));
                config.oldReplySort && API.addCss(API.getCss("oldReplySort.css"));
                this.style();
            }
            async style() {
                const arr = document.querySelectorAll("style");
                arr.forEach((d, i) => {
                    d.outerHTML.includes("/*热门评论分割线*/") && arr[i].remove()
                })
            }
        }
        new ReplyList().init();
        API.jsonphook(["api.bilibili.com/x/v2/reply?"], (xhr) => {
            !xhr.url.includes("mobi_app") && (xhr.url += `&mobi_app=android`);
        })
        config.commentLinkDetail && API.importModule("commentLinkDetail.js");
    } catch (e) { toast.error("replyList.js", e) }
})();