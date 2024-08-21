package com.icehufs.icebreaker.provider;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.internet.MimeMessage;

@Component
@RequiredArgsConstructor
public class EmailProvider {
    private final JavaMailSender javaMailSender;

    private final String SUBJECT = "[ICEBreaker] 인증 메일입니다.";

    public boolean sendCertificationMail(String email, String certificationNumber) {

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(message, true);

            String htmlContent = getCertificationMessage(certificationNumber);
            // System.out.println(email);
            messageHelper.setTo(email);
            messageHelper.setSubject(SUBJECT);
            messageHelper.setText(htmlContent, true);

            javaMailSender.send(message);

        } catch (Exception exception) {
            exception.printStackTrace();
            return false;
        }

        return true;

    }
    private String getCertificationMessage(String certificationNumber) {
        String certificationMessage = "";
        // HTML 컨텐츠 시작
        certificationMessage += "<!DOCTYPE html><html lang='ko'><head><meta charset='UTF-8'><title>인증 이메일</title></head><body>";
        certificationMessage += "<div style='font-family: Arial, sans-serif; background: linear-gradient(to right, #021A5C, #008395); color: white; margin: 0; padding: 20px;'>";
        certificationMessage += "<div style='background-color: white; width: 100%; max-width: 600px; margin: auto; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: white;'>";
        // 이미지 크기 변경: width를 100px에서 200px로 조정
        certificationMessage += "<img src='https://scontent-ssn1-1.xx.fbcdn.net/v/t39.30808-6/305400531_193076019783239_4457393499802681160_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=XPRG4wEhxxIQ7kNvgFJJLXM&_nc_ht=scontent-ssn1-1.xx&oh=00_AYAejq4MPpCFQVPpJcCtoYMK7utRxJ9gEeTkaUF3tgt8wQ&oe=66CB3A86' alt='Company Logo' style='display: block; margin: auto; width: 200px; height: auto;'>";
        certificationMessage += "<h1 style='text-align: center; color: #021A5C; margin-top: 20px;'>[AdvICE] 인증메일</h1>";
        certificationMessage += "<div style='text-align: center; margin-top: 40px; color: #021A5C; font-size: 20px;'>"; // 여기에 스타일을 하나로 합쳐서 수정했습니다.
        certificationMessage += "인증코드 : <strong>" + certificationNumber + "</strong></div></div>";
        certificationMessage += "</div></div>";
        // HTML 컨텐츠 종료
        certificationMessage += "</body></html>";
        return certificationMessage;
    }
    
}
