package com.icehufs.icebreaker.service.implement;


import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.icehufs.icebreaker.dto.request.user.AuthorityRequestDto;
import com.icehufs.icebreaker.dto.request.user.PatchUserPassRequestDto;
import com.icehufs.icebreaker.dto.request.user.PatchUserRequestDto;
import com.icehufs.icebreaker.dto.response.ResponseDto;
import com.icehufs.icebreaker.dto.response.auth.SignUpResponseDto;
import com.icehufs.icebreaker.dto.response.user.Authority1ExistResponseDto;
import com.icehufs.icebreaker.dto.response.user.AuthorityResponseDto;
import com.icehufs.icebreaker.dto.response.user.DeleteUserResponseDto;
import com.icehufs.icebreaker.dto.response.user.GetSignInUserResponseDto;
import com.icehufs.icebreaker.dto.response.user.PatchUserPassResponseDto;
import com.icehufs.icebreaker.dto.response.user.PatchUserResponseDto;
import com.icehufs.icebreaker.entity.AuthorityEntity;
import com.icehufs.icebreaker.entity.User;
import com.icehufs.icebreaker.repository.ArticleRepository;
import com.icehufs.icebreaker.repository.AuthorityRepository;
import com.icehufs.icebreaker.repository.UserRepository;
import com.icehufs.icebreaker.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImplement implements UserService {

    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(String email) {
        User userEntity = null;

        try {
            userEntity = userRepository.findByEmail(email);
            if (userEntity == null ) return GetSignInUserResponseDto.notExistUser();

        } catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetSignInUserResponseDto.success(userEntity);
    }

    @Override
    public ResponseEntity<? super PatchUserResponseDto> patchUser(PatchUserRequestDto dto, String email){
                try{

                    User userEntity = userRepository.findByEmail(email);
                    if(userEntity == null) return PatchUserResponseDto.notExistUser();

                    userEntity.patchUser(dto);
                    userRepository.save(userEntity);
        
                }catch(Exception exception){
                    exception.printStackTrace();
                    return ResponseDto.databaseError();
                }
                
                return PatchUserResponseDto.success();
            }

    @Override
    public ResponseEntity<? super PatchUserPassResponseDto> patchUserPass(PatchUserPassRequestDto dto) {
        try{

            User userEntity = userRepository.findByEmail(dto.getEmail());
            if(userEntity == null) return PatchUserResponseDto.notExistUser();

            String password = dto.getPassword();
            String encodedPassword = passwordEncoder.encode(password);

            dto.setPassword(encodedPassword);
            userEntity.patchUserPass(dto);
            userRepository.save(userEntity);

        }catch(Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        
        return PatchUserPassResponseDto.success();
    }

    @Override
    public ResponseEntity<? super DeleteUserResponseDto> deleteUser(String email) {
        try{

            User userEntity = userRepository.findByEmail(email);
            if(userEntity == null) return DeleteUserResponseDto.notExistUser();


            userRepository.delete(userEntity);

        }catch(Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        
        return DeleteUserResponseDto.success();
    }

    @Override
    public ResponseEntity<? super AuthorityResponseDto> giveAuthority(AuthorityRequestDto dto, String email) {

        try{

            AuthorityEntity authorityEntity = authorityRepository.findByEmail(email);
            if(authorityEntity == null) return AuthorityResponseDto.notExistUser();
 
            //System.out.println(admin1);
            if(dto.getRoleAdmin1() == 1){ //익명게시판 운영자 권한 부여
                authorityEntity.giveAdmin1Auth();
            }

            if(dto.getRoleAdminC1() == 1){ //코딩존 운영자 권한 부여
                authorityEntity.giveAdminC1Auth();
            }

            if(dto.getRoleAdminC2() == 1){ //코딩존 운영자 권한 부여
                authorityEntity.giveAdminC2Auth();
            }

            if(dto.getRoleAdmin() == 1){ //코딩존 운영자 권한 부여
                authorityEntity.giveAdminAuth();
            }
            authorityRepository.save(authorityEntity);

        } catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
    }
    return AuthorityResponseDto.success();
    }
    

    @Override
    public ResponseEntity<? super Authority1ExistResponseDto> auth1Exist(String email) {

        try{

            AuthorityEntity authorityEntity = authorityRepository.findByEmail(email);
            if(authorityEntity == null) return Authority1ExistResponseDto.notExistUser();
 
            String admin1 = authorityEntity.getRoleAdmin1();
            System.out.println(admin1);
            if("NULL".equals(admin1)){
                return Authority1ExistResponseDto.notAdmin();
            }

        } catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
    }
    return Authority1ExistResponseDto.success();
    }

}