package com.icehufs.icebreaker.common;

public interface ResponseMessage {
        //HTTP Status 200
        String SUCCESS = "Success.";

        //HTTP Status 400
        String VALIDATION_FAILED= "Validati on failed.";
        String DUPLICATE_EMAIL = "Duplicate email.";
        String NOT_EXISTED_USER = "This user does not exist.";
        String NOT_EXISTED_ARTICLE = "This article does not exist.";

        //HTTP Status 401
        String SIGN_IN_FAIL = "Login information mismatch.";
        String AUTHORIZATION_FAIL = "Authorization Failed.";

        //HTTP Status 403
        String NO_PERMISSION = "Do not have permission.";
        String BANNED_USER = "User is currently banned from posting";

        //HTTP Status 500
        String MAIL_FAIL = "Mail send Failed";
        String DATABASE_ERROR = "Database error.";


}
