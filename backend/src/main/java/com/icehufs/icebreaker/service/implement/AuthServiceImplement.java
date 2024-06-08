package com.icehufs.icebreaker.service.implement;

import java.time.LocalDateTime;
import java.time.Period;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icehufs.icebreaker.common.CertificationNumber;
import com.icehufs.icebreaker.dto.request.auth.CheckCertificationRequestDto;
import com.icehufs.icebreaker.dto.request.auth.EmailCertificationRequestDto;
import com.icehufs.icebreaker.dto.request.auth.GiveUserBanRequestDto;
import com.icehufs.icebreaker.dto.request.auth.SignInRequestDto;
import com.icehufs.icebreaker.dto.request.auth.SignUpRequestDto;
import com.icehufs.icebreaker.dto.response.ResponseDto;
import com.icehufs.icebreaker.dto.response.auth.CheckCertificationResponseDto;
import com.icehufs.icebreaker.dto.response.auth.CheckUserBanResponseDto;
import com.icehufs.icebreaker.dto.response.auth.EmailCertificationResponseDto;
import com.icehufs.icebreaker.dto.response.auth.GiveUserBanResponseDto;
import com.icehufs.icebreaker.dto.response.auth.PassChanEmailCertificationResponseDto;
import com.icehufs.icebreaker.dto.response.auth.SignInResponseDto;
import com.icehufs.icebreaker.dto.response.auth.SignUpResponseDto;
import com.icehufs.icebreaker.entity.Article;
import com.icehufs.icebreaker.entity.BanDurationEnum;
import com.icehufs.icebreaker.entity.BanReasonEnum;
import com.icehufs.icebreaker.entity.CertificationEntity;
import com.icehufs.icebreaker.entity.User;
import com.icehufs.icebreaker.entity.UserBan;
import com.icehufs.icebreaker.provider.EmailProvider;
import com.icehufs.icebreaker.provider.JwtProvider;
import com.icehufs.icebreaker.repository.ArticleRepository;
import com.icehufs.icebreaker.repository.CertificationRepository;
import com.icehufs.icebreaker.repository.CommentRepository;
import com.icehufs.icebreaker.repository.FavoriteRepository;
import com.icehufs.icebreaker.repository.UserBanRepository;
import com.icehufs.icebreaker.repository.UserRepository;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
import com.icehufs.icebreaker.service.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImplement implements AuthService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    private final CertificationRepository certificationRepository;
    private final EmailProvider emailProvider;
    private final UserBanRepository userBanRepository;

    // 운영자의 게시글 삭제 관련 레포지토리
    private final ArticleRepository articleRepository;
    private final CommentRepository commentRepository;
    private final FavoriteRepository favoriteRepository;
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
            System.out.println(token);

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

            // 전에 이 이메일로 인증번호를 받은적 있으면 그 이메일 삭제
            CertificationEntity certificationEntity1 = certificationRepository.findByUserEmail(email);
            if (certificationEntity1 != null){
                certificationRepository.delete(certificationEntity1);
            }

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
        // System.out.println("Starting certification check for email: " + dto.getEmail());
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
    public ResponseEntity<? super GiveUserBanResponseDto> giveUserBan(GiveUserBanRequestDto dto, Integer articleNum) {
        try {
            String email = dto.getEmail();
            boolean ban_email = userBanRepository.existsByEmail(email);

            // 이미 정지된 계정일 경우.(운영자가 한 번에 단일 작성자의 문제가 있는 여러 게시글에 정지를 부여할 경우.)
            if (ban_email) {
                return GiveUserBanResponseDto.duplicateId();
            }

            // 정지하려는 유저의 이메일이 User테이블에 등록이 안되어있을 경우.
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return GiveUserBanResponseDto.notExistUser();

            // 게시글의 번호를 통해서 작성자의 이메일 확인
            Article articleEntity = articleRepository.findByArticleNum(articleNum);
            String writerEmail = articleEntity.getUserEmail();

            // 게시글의 작성자의 이메일과 정지하려는 이메일이 불일치할 경우.
            boolean isWriter = writerEmail.equals(email);
            if (!isWriter) return GiveUserBanResponseDto.notMatchId();

            // 만일 게시글이 존재하지 않을 경우.
            if (articleEntity == null) return GiveUserBanResponseDto.noExistArticle();

            BanDurationEnum banDuration = BanDurationEnum.valueOf(dto.getBanDuration().toUpperCase());
            BanReasonEnum banReason = BanReasonEnum.valueOf(dto.getBanReason().toUpperCase());
            UserBan userBan = new UserBan();
            userBan.setEmail(email);
            userBan.setBanDuration(banDuration);
            userBan.setBanReason(banReason);
            userBan.setBanStartTime(LocalDateTime.now());

            commentRepository.deleteByArticleNum(articleNum);
            favoriteRepository.deleteByArticleNum(articleNum);
            articleRepository.delete(articleEntity);

            userBanRepository.save(userBan);
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GiveUserBanResponseDto.success();
    }

    @Override
    public ResponseEntity<? super PassChanEmailCertificationResponseDto> passChanEmailCertif(EmailCertificationRequestDto dto){
        try {
            
            String email = dto.getEmail();

            // 존재하는 이메일인지 확인.
            boolean isExistEmail = userRepository.existsByEmail(email);
            if (!isExistEmail) return PassChanEmailCertificationResponseDto.notExistUser();

            CertificationEntity certificationEntity1 = certificationRepository.findByUserEmail(email);
            if (certificationEntity1 != null){
                certificationRepository.delete(certificationEntity1);
            }

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

        return PassChanEmailCertificationResponseDto.success();
    }

    @Override
    public ResponseEntity<? super CheckUserBanResponseDto> checkUserBanStatus(String token) {
        try {
            String email = jwtProvider.extractEmail(token);
            UserBan userBan = userBanRepository.findByEmail(email);
            // 만일 계정이 정지되어있다면..
            if (userBan != null){
                LocalDateTime banEndTime = userBan.getBanStartTime().plus(getPeriod(userBan.getBanDuration()));
                // 활동 정지가 만료되지 않았을 경우
                if (LocalDateTime.now().isBefore(banEndTime)) {
                    return CheckUserBanResponseDto.success(userBan.getEmail(), userBan.getBanDuration(), userBan.getBanStartTime(), userBan.getBanReason());
                    // 활동 정지가 만료되었을 경우
                } else {
                    userBanRepository.delete(userBan);
                    return CheckUserBanResponseDto.notBanned();
                }
            } else {
                return CheckUserBanResponseDto.notBanned();
            }
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }

    // BanDuration 엔티티를 받아와 사용.
    private Period getPeriod(BanDurationEnum banDuration) {
        switch (banDuration) {
            case ONE_MONTH:
                return Period.ofMonths(1);
            case SIX_MONTHS:
                return Period.ofMonths(6);
            case ONE_YEAR:
                return Period.ofYears(1);
            case PERMANENT:
                return Period.ofYears(100);  // 100년이기에 사실상 영구정지와 같다.
            default:
                throw new IllegalArgumentException("Unknown ban duration: " + banDuration);
        }
    }
}
