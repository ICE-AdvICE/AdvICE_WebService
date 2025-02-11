package com.icehufs.icebreaker.common;

public interface ResponseMessage {
        //HTTP Status 200
        String SUCCESS = "Success.";
        String CODING_ADMIN ="This user is coding-zone admin.";
        String ENTIRE_ADMIN ="This user is entire admin.";

        //HTTP Status 400
        String VALIDATION_FAILED= "Validation failed.";
        String DUPLICATE_EMAIL = "Duplicate email.";
        String NOT_EXISTED_USER = "This user does not exist.";
        String NOT_EXISTED_ARTICLE = "This article does not exist.";
        String NOT_EXISTED_COMMET = "Thie comment does not exist.";
        String FULL_CLASS = "This class already full.";
        String ALREADY_RESERVE = "Alredy reserve class.";
        String NOT_RESERVE_CLASS = "Not reserve class.";
        String NOT_SIGNUP_USER = "Not signUp user.";
        String PERMITTED_ERROR = "Permission error.";

        //HTTP Status 401
        String SIGN_IN_FAIL = "Login information mismatch.";
        String AUTHORIZATION_FAIL = "Authorization Failed.";

        //HTTP Status 403
        String NO_PERMISSION = "Do not have permission.";
        String BANNED_USER = "User is currently banned from posting.";

        //HTTP Status 404
        String SUCCESS_BUT_NOT = "Success but not.";
        String WITHDRAWN_EMAIL = "User who has withdrawn.";

        //HTTP Status 500
        String MAIL_FAIL = "Mail send Failed.";
        String DATABASE_ERROR = "Database error.";
        String DOES_NOT_MATCH_EMAIL ="Doesn't Match Email.";
        String INTERNAL_SERVER_ERROR = "Internal Server Error.";


}
