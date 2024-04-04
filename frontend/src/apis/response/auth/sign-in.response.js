const ResponseCode = require("../../types/enum");

const SignInResponseDto  = {
    code: ResponseCode.any, // ResponseCode 사용 예시
    message: "",
    token: "",
    expirationTime: 0

};