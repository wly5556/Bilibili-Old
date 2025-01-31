/**
 * 本模块封装了urlAPI请求以便于访问
 */
(function () {
    class Url {
        access_key: string = GM.getValue("access_key", undefined);
        /**
         * url的默认参数，即UrlDetail未列出或可选的部分
         */
        jsonUrlDefault = {
            "api.bilibili.com/pgc/player/web/playurl": { qn: 125, otype: 'json', fourk: 1 },
            "api.bilibili.com/x/player/playurl": { qn: 125, otype: 'json', fourk: 1 },
            "interface.bilibili.com/v2/playurl": { appkey: 9, otype: 'json', quality: 125, type: '' },
            "bangumi.bilibili.com/player/web_api/v2/playurl": { appkey: 9, module: "bangumi", otype: 'json', quality: 125, type: '' },
            "api.bilibili.com/pgc/player/api/playurlproj": { access_key: this.access_key, appkey: 0, otype: 'json', platform: 'android_i', qn: 208 },
            "app.bilibili.com/v2/playurlproj": { access_key: this.access_key, appkey: 0, otype: 'json', platform: 'android_i', qn: 208 },
            "api.bilibili.com/pgc/player/api/playurltv": { appkey: 6, qn: 125, fourk: 1, otype: 'json', fnver: 0, fnval: 2000, platform: "android", mobi_app: "android_tv_yst", build: 102801 },
            "api.bilibili.com/x/tv/ugc/playurl": { appkey: 6, qn: 125, fourk: 1, otype: 'json', fnver: 0, fnval: 2000, platform: "android", mobi_app: "android_tv_yst", build: 102801 },
            "app.bilibili.com/x/intl/playurl": { access_key: this.access_key, mobi_app: "android_i", fnver: 0, fnval: 2000, qn: 125, platform: "android", fourk: 1, build: 2100110, appkey: 0, otype: 'json', ts: new Date().getTime() },
            "apiintl.biliapi.net/intl/gateway/ogv/player/api/playurl": { access_key: this.access_key, mobi_app: "android_i", fnver: 0, fnval: 2000, qn: 125, platform: "android", fourk: 1, build: 2100110, appkey: 0, otype: 'json', ts: new Date().getTime() }
        }
        /**
         * 请求封装好的json请求
         * @param url 请求的url
         * @param detail 请求所需配置数据
         * @param GM 是否使用跨域请求
         * @returns Promise封装的返回值
         */
        getJson<T extends keyof jsonUrlDetail>(url: T, detail: jsonUrlDetail[T], GM = false) {
            let obj: any = { ...(this.jsonUrlDefault[url] || {}), ...detail };
            Reflect.has(obj, "appkey") && (obj = this.sign(obj));
            return GM ? xhr.GM({
                url: API.objUrl(`//${url}`, obj),
                responseType: "json"
            }) : xhr({
                url: API.objUrl(`//${url}`, obj),
                responseType: "json",
                credentials: true
            })
        }
        sign(obj: any) {
            return API.urlObj(`?${API.urlsign("", obj, obj.appkey)}`);
        }
    }
    const exports = new Url();
    API.getJson = <T extends keyof jsonUrlDetail>(url: T, detail: jsonUrlDetail[T], GM?: boolean) => {
        try {
            return exports.getJson(url, detail, GM);
        } catch (e) { toast.error("url.js", e) }
    }
})();
/**
 * 封装好json请求所需参数  
 * 请一并配置好Url.jsonUrlDefault默认值
 */
interface jsonUrlDetail {
    /**
     * 网页端bangumi playurl
     */
    "api.bilibili.com/pgc/player/web/playurl": { avid: number, cid: number, qn?: number, fnver?: number, fnval?: number }
    /**
     * 网页端一般视频playurl
     */
    "api.bilibili.com/x/player/playurl": { avid: number, cid: number, qn?: number, fnver?: number, fnval?: number }
    /**
     * Interface playurl  
     * 这版url没有防盗链检测
     */
    "interface.bilibili.com/v2/playurl": { cid: number, quality?: number }
    /**
     * Interface bangumi playuel  
     * 这版url没有防盗链检测
     */
    "bangumi.bilibili.com/player/web_api/v2/playurl": { cid: number, quality?: number }
    /**
     * 投屏 bangumi playurl
     */
    "api.bilibili.com/pgc/player/api/playurlproj": { cid: number }
    /**
     * 投屏 普通视频 playurl
     */
    "app.bilibili.com/v2/playurlproj": { cid: number }
    /**
     * TV端 bangumi playurl
     */
    "api.bilibili.com/pgc/player/api/playurltv": { avid: number, cid: number, qn?: number, fnver?: number, fnval?: number, build?: number }
    /**
     * TV 普通视频 playurl
     */
    "api.bilibili.com/x/tv/ugc/playurl": { avid: number, cid: number, qn?: number, fnver?: number, fnval?: number, build?: number }
    /**
     * Android Play一般视频
     */
    "app.bilibili.com/x/intl/playurl": { aid: number, cid: number, qn?: number, fnver?: number, fnval?: number, build?: number }
    /**
     * Android Play bangumi视频
     */
    "apiintl.biliapi.net/intl/gateway/ogv/player/api/playurl": { ep_id: number, cid: number, qn?: number, fnver?: number, fnval?: number, build?: number }
}
declare namespace API {
    /**
     * 请求封装好的json请求
     * @param url 请求的url
     * @param detail 请求所需配置数据
     * @param GM 是否使用跨域请求
     * @returns Promise封装的返回值
     */
    function getJson<T extends keyof jsonUrlDetail>(url: T, detail: jsonUrlDetail[T], GM?: boolean): Promise<any>;
}