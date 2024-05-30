package com.icehufs.icebreaker.service.implement;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.icehufs.icebreaker.dto.request.user.PatchUserPassRequestDto;
import com.icehufs.icebreaker.dto.request.user.PatchUserRequestDto;
import com.icehufs.icebreaker.dto.response.ResponseDto;
import com.icehufs.icebreaker.dto.response.user.DeleteUserResponseDto;
import com.icehufs.icebreaker.dto.response.user.GetSignInUserResponseDto;
import com.icehufs.icebreaker.dto.response.user.PatchUserPassResponseDto;
import com.icehufs.icebreaker.dto.response.user.PatchUserResponseDto;
import com.icehufs.icebreaker.entity.Article;
import com.icehufs.icebreaker.entity.User;
import com.icehufs.icebreaker.repository.ArtileListViewRepository;
import com.icehufs.icebreaker.repository.UserRepository;
import com.icehufs.icebreaker.service.ArticleService;
import com.icehufs.icebreaker.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImplement implements UserService {

    private final UserRepository userRepository;
    private final ArtileListViewRepository artileListViewRepository;
    private final ArticleService articleService;

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
    public ResponseEntity<? super PatchUserPassResponseDto> patchUserPass(PatchUserPassRequestDto dto, String email) {
        try{

            User userEntity = userRepository.findByEmail(email);
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
        List<Article> articleListViewEntities = new ArrayList<>();
        try{

            User userEntity = userRepository.findByEmail(email);
            if(userEntity == null) return DeleteUserResponseDto.notExistUser();

            articleListViewEntities = artileListViewRepository.findByUserEmailOrderByArticleDateDesc(email);

            for (Article article : articleListViewEntities) {
                articleService.deleteArticle(article.getArticleNum(), email);
            }

            userRepository.delete(userEntity);

        }catch(Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        
        return DeleteUserResponseDto.success();
    }
    
}
