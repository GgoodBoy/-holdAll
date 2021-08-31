export const randomNum = (len) => {
    var salt = '';
    for (var i = 0; i < len; i++) {
        var tmp = parseInt(Math.floor(Math.random() * 10));
        if (!tmp) {
            tmp = '2';
        }
        salt += tmp;
    }
    return salt;
};
/*
 * 图片串接 createImgsrc
 * */
export const createImgsrc = (data, options = {}) => {
    var src, op_str = '';
    if (typeof data == 'object' && data.host) {
        options.orient = 1;
        options.type = options.type || 'imageMogr2';
        op_str = '?' + options.type;

        if (options.type == 'imageView2') {
            if (options.width || options.height) {
                op_str += '/2/';
                if (options.width && options.height) {
                    op_str += ('w/' + options.width + 'h/' + options.height);
                } else if (options.width) {
                    op_str += ('w/' + options.width)
                } else if (options.height) {
                    op_str += ('h/' + options.height)
                }
            }
            if (options.format && data.file.indexOf('.gif') == -1) {
                op_str += '/format/' + options.format;
            }
        } else {
            if (options.orient) {
                op_str += '/auto-orient'
            }
            if (options.width || options.height) {
                op_str += '/thumbnail/';
                if (options.width && options.height) {
                    op_str += ('!' + options.width + 'x' + options.height + 'r');
                } else if (options.width) {
                    op_str += (options.width + 'x')
                } else if (options.height) {
                    op_str += ('x' + options.height)
                }
            }
            if (options.format && data.file.indexOf('.gif') == -1) {
                op_str += '/format/' + options.format;
            }
        }
        data.host = data.host && data.host.replace(/(http:|https:)/, '');
        src = [data.host, data.file, (options.type ? data.format : ''), op_str].join('');
        return src;
    } else if (typeof data == 'string') {
        return data
    }
    return false;
};
/*
 * 验证 http链接
 * */
export const urlTest = (url) => {
    if (url.toString().indexOf('http://') < 0 && url.toString().indexOf('https://') < 0) {
        url = 'http://' + url;
    }
    const reg = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
    if (reg.test(url)) {
        return url;
    } else {
        return -1;
    }
};
