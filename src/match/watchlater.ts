/**
 * 本模块负责重写稍后再看页面
 */
(function () {
    try {
        if (!API.uid) toast.warning("未登录，无法启用稍后再看！");
        else {
            API.path.name = "watchlater";
            // 备份还原旧版播放器设置数据
            API.restorePlayerSetting();
            API.scriptIntercept(["video-nano"]); // 新版播放器拦截
            API.scriptIntercept(["stardust-video"]); // 新版播放器拦截
            API.rewriteHTML(config.trusteeship ? API.getModule("watchlater.html").replace("static.hdslb.com/js/video.min.js", "cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/dist/video.min.js") : API.getModule("watchlater.html"));
            API.addCss(API.getModule("bofqi.css"));
            // 修复评论跳转
            (<any>window).commentAgent = { seek: (t: any) => (<any>window).player && (<any>window).player.seek(t) };
            // 添加点赞功能
            config.enlike && API.importModule("enLike.js");
            API.addCss(API.getModule("mini-bofqi.css"));
            // 修正分区信息
            API.importModule("videoSort.js");
            API.path.forEach(d => { d.includes("av") && (API.aid = Number(/[0-9]+/.exec(d)[0])) })
        }
    } catch (e) { toast.error("watchlater.js", e) }
})();