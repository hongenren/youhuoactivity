let Cpanel = function(){
    let cpanel = {};
    cpanel.get_args = function(){
        let arg_name = arguments;       //希望获取的参数名列表
        let caller = cpanel.get_args.caller;
        let args = caller.arguments;    //实际传入的参数值列表
        let param = {};
        let callback = {};
        if(get_data_type(args[1]) === 'Array'){
            let actual_param_length = (arg_name.length > args[1].length) ? args[1].length : arg_name.length;
            for(let i = 0; i < actual_param_length; i ++){
                param[arg_name[i]] = args[1][i];
            }
            callback = args[0];
        }else if(get_data_type(args[1]) === 'Object'){
            let actual_param_length = (arg_name.length > Object.getOwnPropertyNames(args[1]).length) ? Object.getOwnPropertyNames(args[1]).length : arg_name.length;
            for(let i = 0; i < actual_param_length; i ++){
                if(args[1].hasOwnProperty(from_camel(arg_name[i]))) {
                    param[arg_name[i]] = args[1][from_camel(arg_name[i])];
                }
            }
            callback = args[0];
        }else{
            let actual_param_length = (arg_name.length > args.length - 1) ? args.length : arg_name.length + 1;
            for(let i = 1; i < actual_param_length; i ++){
                param[arg_name[i - 1]] = args[i];
            }
            callback = args[0];
        }
        return {option:param, callback:callback};
    };
    cpanel.get_api = function(api, type, param, callback){
        let need_origin = false;
        if(arguments.length === 5){
            need_origin = arguments[4];
        }
        if(type.toLowerCase() === 'get'){
            $.ajax({
                "url" : API_BASE_URL + api,
                "type" : "get",
                "dataType" : "json",
                "data" : param,
                success : function(data){
                    if(need_origin){
                        data.origin_param = param;
                    }
                    callback(data);
                },
            });
        }else if(type.toLowerCase() === 'post'){
            $.ajax({
                "url" : API_BASE_URL + api,
                "type" : "post",
                "dataType" : "json",
                "data" : param,
                success : function(data){
                    if(need_origin){
                        data.origin_param = param;
                    }
                    callback(data);
                },
            });
        }
    };
    cpanel.shift = function(){
        let res = cpanel.shift.caller.arguments[0];
        for(i = 0; i < cpanel.shift.caller.arguments.length; i ++){
            if(i < cpanel.shift.caller.arguments.length - 1) {
                cpanel.shift.caller.arguments[i] = cpanel.shift.caller.arguments[i + 1];
            }else{
                delete cpanel.shift.caller.arguments[i];
            }
        }
        return res;
    };
    cpanel.api_post_add_station = function(){
        let res = this.get_args("threeLevelId","stationName","area");
        let option = res.option;
        let callback = res.callback;
        this.get_api(API_POST_ADD_STATION, 'post', option, function(data){
            callback(data);
        });
    };
    cpanel.api_get_station_list = function(){
        let res = this.get_args("stationId","stationName","pageNum","pageSize");
        let option = res.option;
        let callback = res.callback;
        this.get_api(API_GET_STATION_LIST, 'get', option, function(data){
            callback(data);
        });
    };
    cpanel.api_get_station_list_by_three_id = function(){
        let res = this.get_args("threeLevelId");
        let option = res.option;
        let callback = res.callback;
        this.get_api(API_GET_STATION_LIST_BY_THREE_ID, 'get', option, function(data){
            callback(data);
        });
    };
    cpanel.api_get_station_by_id = function(){
        let res = this.get_args("stationId");
        let option = res.option;
        let callback = res.callback;
        this.get_api(API_GET_STATION_BY_ID, 'get', option, function(data){
            callback(data);
        });
    };


    cpanel.get_reporter_by_ids = function () {
        let res = this.get_args("reporterId");
        let option = res.option;
        let callback = res.callback;
        this.get_api(API_GET_REPORTER_BY, 'get', option, function (data) {
            callback(data);
        });
    };
    cpanel.api_post_add_reporter = function () {
        let res = this.get_args("reporterId","reporterName","reporterHeaderUrl","reporterRealName","reporterNum","stationId","validityDate","isAdmin");
        let option = res.option;
        let callback = res.callback;
        this.get_api(API_POST_ADD_REPORTER, 'post', option, function (data) {
            callback(data);
        });
    };
    cpanel.api_post_del_reporter = function () {
        let res = this.get_args("id");
        let option = res.option;
        let callback = res.callback;
        this.get_api(API_POST_DEL_REPORTER, 'post', option, function (data) {
            callback(data);
        });
    };


    return cpanel;
};