package com.icehufs.icebreaker.service.implement;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.icehufs.icebreaker.dto.response.ResponseDto;
import com.icehufs.icebreaker.dto.response.user.GetSignInUserResponseDto;
import com.icehufs.icebreaker.entity.User;
import com.icehufs.icebreaker.repository.UserRepository;
import com.icehufs.icebreaker.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImplement implements UserService {

    private final UserRepository userRepository;

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
    
}
