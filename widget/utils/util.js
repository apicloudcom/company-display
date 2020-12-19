const $util = {
    openWin(param){
        var param = {
            name: param.name,
            url: param.url,
            title: param.title||'',
            pageParam: param.pageParam||{},
            hideNavigationBar: false,
            navigationBar:{
                shadow: '#fff',
                backButton: {
                    iconPath: 'widget://images/back/back.png'
                }
            }
        };
        if (this.isApp()) {
            api.openTabLayout(param);
        } else {
            api.openWin(param);
        }
    },
    isApp(){
        if (api.platform && api.platform == 'app') {
            return true;
        }
        return false;
    },
    fitRichText(richtext, width){
        var str = `<img style="max-width:${width}px;"`;
        var result = richtext.replace(/\<img/gi, str);
        return result;
    }
}
export default $util;
