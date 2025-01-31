/**
 * 添加下载右键菜单
 */
(function () {
    API.switchVideo(() => {
        try {
            const li = document.createElement("li");
            li.innerHTML = '<a id="BLOD-dl-content" class="context-menu-a js-action" href="javascript:void(0);">下载视频</a>';
            li.setAttribute("class", "context-line context-menu-function bili-old-download");
            li.onmouseover = () => li.setAttribute("class", "context-line context-menu-function bili-old-download hover");
            li.onmouseout = () => li.setAttribute("class", "context-line context-menu-function bili-old-download");
            li.onclick = () => API.downloadThis();
            let flag = 0;
            document.querySelector("#bilibiliPlayer")?.addEventListener("DOMNodeInserted", e => {
                if (!flag && (<HTMLElement>e.target).className && /context-line context-menu-function/.test((<HTMLElement>e.target).className)) {
                    const node = document.querySelector(".bilibili-player-context-menu-container.black");
                    flag = setTimeout(() => {
                        if (node.querySelector(".context-menu-danmaku")) return;
                        if (node.querySelector("#BLOD-dl-content")) return;
                        if (node.contains(li)) return;
                        node.firstChild.appendChild(li);
                    }, 100);
                }
            })
            document.querySelector("#bilibiliPlayer")?.addEventListener("DOMNodeRemoved", e => {
                if (flag && (<HTMLElement>e.target).className && /context-line context-menu-function/.test((<HTMLElement>e.target).className)) {
                    flag = 0;
                    try { li.remove() } catch { };
                }
            })
        } catch (e) { toast.error("dlContentMenu.js", e) }
    })
})();