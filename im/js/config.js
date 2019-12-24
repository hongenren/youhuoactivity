//============================普通类型变量=======================================
let USER_NAME = "";

const WEBSOCKET_SERVER_HOST = "ws://106.14.172.101:58080";
const IS_DEBUG = true; // 是否为调试模式
const COOKIE_RECEIVE_MESSAGE_KEY = "receiveMessage"; // 使用此值进行接收消息cookies存储时的key
const COOKIE_SEND_MESSAGE_KEY = "sendMessage"; // 使用此值进行发送消息cookies存储时的key
//============================对象类型变量=======================================
let USER_INFO = new Object();
let scrollBool=false;
let COMMON_ADDR = "http://h5.shcvs.cn/";
/**
 * 返回码参考
 * @type {{CONNECT_SUCCESS: number, NOTICE_MESSAGE: number, SUCCESS: number,
 *          UNKNOWN_ERROR: number, MESSAGE_IS_NONE: number, TARGET_CLIENT_IS_NONE: number,
 *          INCOMPLETE_PARAMETERS: number, ADD_CLIENT: number, DELETE_CLIENT: number,
 *          RECEIVE_MESSAGE: number}}
 */
const ReturnCode = {
    CONNECT_SUCCESS : 10000,
    NOTICE_MESSAGE : 10001,
    SUCCESS : 20000,
    UNKNOWN_ERROR : 20001,
    MESSAGE_IS_NONE : 20002,
    TARGET_CLIENT_IS_NONE : 20003,
    INCOMPLETE_PARAMETERS : 20004,
    ADD_CLIENT : 20005,
    DELETE_CLIENT : 20006,
    RECEIVE_MESSAGE: 30001,
    NOT_READ_MESSAGE: 10002,
    SPECIAL_MESSAGE: 30003
};

/**
 * 信息级别
 * @type {{INFO: string, DEBUG: string, WARNING: string, ERROR: string}}
 */
const MessageLevel = {
    INFO: "info",
    DEBUG: "debug",
    WARNING: "warning",
    ERROR: "error"
}