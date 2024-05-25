package com.icehufs.icebreaker.common;

public interface ResponseCode {
    //HTTP Status 200
    String SUCCESS = "SU";

    //HTTP Status 400
    String VALIDATION_FAILED= "VF";
    String DUPLICATE_EMAIL = "DE";
    String NOT_EXISTED_USER = "NU";
    String NOT_EXISTED_ARTICLE = "NA";

    //HTTP Status 401
    String SIGN_IN_FAIL = "SF";
    String AUTHORIZATION_FAIL = "AF";

    //HTTP Status 403
    String NO_PERMISSION = "NP";
    String BANNED_USER = "BU";

    //HTTP Status 500
    String MAIL_FAIL = "MF";
    String DATABASE_ERROR = "DBE";
}
