package com.icehufs.icebreaker.service.implement;

import com.icehufs.icebreaker.common.CertificationNumber;
import com.icehufs.icebreaker.dto.request.auth.*;
import com.icehufs.icebreaker.dto.response.auth.*;
import com.icehufs.icebreaker.entity.BanDuration;
import com.icehufs.icebreaker.entity.CertificationEntity;
import com.icehufs.icebreaker.entity.UserBan;
import com.icehufs.icebreaker.provider.EmailProvider;
import com.icehufs.icebreaker.repository.CertificationRepository;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
import com.icehufs.icebreaker.repository.UserBanRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.icehufs.icebreaker.dto.response.ResponseDto;
import com.icehufs.icebreaker.entity.User;
import com.icehufs.icebreaker.provider.JwtProvider;
import com.icehufs.icebreaker.repository.UserRepository;
import com.icehufs.icebreaker.service.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImplement implements AuthService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    private final CertificationRepository certificationRepository;
    private final EmailProvider emailProvider;
    private final UserBanRepository userBanRepository;
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto) {
        try{

            String email = dto.getEmail(); //이메일 중복을 확인해주는 코드
            boolean existsByEmail = userRepository.existsByEmail(email);
            if (existsByEmail) return SignUpResponseDto.duplicateEmail();

            String password = dto.getPassword(); //비밀번호를 암호화
            String encodedPassword = passwordEncoder.encode(password);
            dto.setPassword(encodedPassword);

            User userEntity = new User(dto); //dto데이터를 entity에 삽입

            userRepository.save(userEntity); //entity를 repository를 통해 db에 저장

        } catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();

        }

        return SignUpResponseDto.success();
    }

    @Override
    public ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto) {

        String token = null; //토큰 선업/초기화
        try{

            String email = dto.getEmail();  //요청으로 받은 이메일 존재 확인
            User userEntity = userRepository.findByEmail(email);
            if (userEntity == null) return SignInResponseDto.signInFail();

            String password = dto.getPassword(); //요청 받은 비번과 해당 유저(이메일)의 비번 일치하는지 확인
            String encodedPassword = userEntity.getPassword();
            // System.out.println("Encoded Password from DB: " + encodedPassword);
            // System.out.println("Input Password: " + password);

            boolean isMatched = passwordEncoder.matches(password, encodedPassword); //입력 받은 비번과 db에 있는 암호화된 비번 확인;
            if(!isMatched) {
                // System.out.println("비밀번호가 일치하지않습니다.");
                return SignInResponseDto.signInFail();
            }

            token = jwtProvider.create(email); //토큰 생성


        } catch(Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return SignInResponseDto.success(token);
        
    }

    @Override
    public ResponseEntity<? super EmailCertificationResponseDto> emailCertification(EmailCertificationRequestDto dto) {
        try {
            // String userId = dto.getId();
            String email = dto.getEmail();

            // 존재하는 이메일인지 확인.
            boolean isExistEmail = userRepository.existsByEmail(email);
            if (isExistEmail) return EmailCertificationResponseDto.duplicateId();

            // 인증번호 생성
            String certificationNumber = CertificationNumber.getCertificationNumber();

            // 이메일 전송 성공 여부 확인
            boolean isSuccessed = emailProvider.sendCertificationMail(email, certificationNumber);
            if (!isSuccessed) return EmailCertificationResponseDto.mailSendFail();

            // 데이터베이스 저장.
            CertificationEntity certificationEntity = new CertificationEntity(email, certificationNumber);
            certificationRepository.save(certificationEntity);


        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return EmailCertificationResponseDto.success();
    }

    @Override
    public ResponseEntity<? super CheckCertificationResponseDto> checkCertification(CheckCertificationRequestDto dto) {
        System.out.println("Starting certification check for email: " + dto.getEmail());
        try {
            // String userId = dto.getId();
            String email = dto.getEmail();
            String certificationNumber = dto.getCertificationNumber();


            CertificationEntity certificationEntity = certificationRepository.findByUserEmail(email);
            // 인증 메일을 보내지 않은 경우.
            if (certificationEntity == null) {
                return CheckCertificationResponseDto.certificationFail();
            }

            boolean isMatched = certificationEntity.getUserEmail().equals(email) && certificationEntity.getCertificationNumber().equals(certificationNumber);

            if (!isMatched) {
                return CheckCertificationResponseDto.certificationFail();
            }


        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return CheckCertificationResponseDto.success();
    }

    @Override
    @Transactional
    public ResponseEntity<? super GiveUserBanResponseDto> giveUserBan(GiveUserBanRequestDto dto) {
        try {
            String email = dto.getEmail();
            User ban_email = userRepository.findByEmail(email);

            // 이미 정지된 계정일 경우.
            if (ban_email == null) {
                return GiveUserBanResponseDto.duplicateId();
            }

            BanDuration banDuration = BanDuration.valueOf(dto.getBanDuration().toUpperCase());
            UserBan userBan = new UserBan();
            userBan.setEmail(email);
            userBan.setBanDuration(banDuration);
            userBan.setBanStartTime(LocalDateTime.now());

            userBanRepository.save(userBan);
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GiveUserBanResponseDto.success();
    }
}
