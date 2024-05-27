package com.icehufs.icebreaker.service.implement;

import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.icehufs.icebreaker.dto.request.article.PatchArticleRequestDto;
import com.icehufs.icebreaker.dto.request.article.PatchCommentRequestDto;
import com.icehufs.icebreaker.dto.request.article.PostArticleRequestDto;
import com.icehufs.icebreaker.dto.request.article.PostCommentRequestDto;
import com.icehufs.icebreaker.dto.response.ResponseDto;
import com.icehufs.icebreaker.dto.response.article.CheckOwnOfArticleResponseDto;
import com.icehufs.icebreaker.dto.response.article.DeleteArticleResponseDto;
import com.icehufs.icebreaker.dto.response.article.DeleteCommentResponseDto;
import com.icehufs.icebreaker.dto.response.article.GetArticleListResponseDto;
import com.icehufs.icebreaker.dto.response.article.GetArticleResponseDto;
import com.icehufs.icebreaker.dto.response.article.GetCommentListResponseDto;
import com.icehufs.icebreaker.dto.response.article.GetUserArticleListResponseDto;
import com.icehufs.icebreaker.dto.response.article.PatchArticleResponseDto;
import com.icehufs.icebreaker.dto.response.article.PatchCommentResponseDto;
import com.icehufs.icebreaker.dto.response.article.PostArticleResponseDto;
import com.icehufs.icebreaker.dto.response.article.PostCommentResponseDto;
import com.icehufs.icebreaker.dto.response.article.PutFavoriteResponseDto;
import com.icehufs.icebreaker.entity.Article;
import com.icehufs.icebreaker.entity.BanDuration;
import com.icehufs.icebreaker.entity.CommentEntity;
import com.icehufs.icebreaker.entity.FavoriteEntity;
import com.icehufs.icebreaker.entity.UserBan;
import com.icehufs.icebreaker.repository.ArticleRepository;
import com.icehufs.icebreaker.repository.ArtileListViewRepository;
import com.icehufs.icebreaker.repository.CommentRepository;
import com.icehufs.icebreaker.repository.FavoriteRepository;
import com.icehufs.icebreaker.repository.GetCommentListReultSet;
import com.icehufs.icebreaker.repository.UserBanRepository;
import com.icehufs.icebreaker.repository.UserRepository;
import com.icehufs.icebreaker.service.ArticleService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArticleServiceImplement implements ArticleService {

    private final ArtileListViewRepository artileListViewRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final FavoriteRepository favoriteRepository;
    private final UserBanRepository userBanRepository;
    
    @Override
    public ResponseEntity<? super PostArticleResponseDto> postArticle(PostArticleRequestDto dto, String email){
        try{
            // 사용자 계정이 존재하는지 확인하는 코드
            boolean existedEmail = userRepository.existsByEmail(email);
            if (!existedEmail) return PostArticleResponseDto.notExistUser();

            // 사용자 계정이 정지되어 있는지 확인하는 코드
            UserBan userBan = userBanRepository.findByEmail(email);
            // 만일 계정이 정지되어있다면..
            if (userBan != null){
                LocalDateTime banEndTime = userBan.getBanStartTime().plus(getPeriod(userBan.getBanDuration()));
                // 활동 정지가 만료되지 않았을 경우
                if (LocalDateTime.now().isBefore(banEndTime)) {
                    return PostArticleResponseDto.bannedUser();
                // 활동 정지가 만료되었을 경우
                } else {
                    userBanRepository.delete(userBan);
                }
            }
            Article articleEntity = new Article(dto, email);
            articleRepository.save(articleEntity);
        }catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return PostArticleResponseDto.success();
    }
    

    @Override
    public ResponseEntity<? super GetArticleResponseDto> getArticle(Integer articleNum) {
        Article articleEntity = null;

        try {
            articleEntity = articleRepository.findByArticleNum(articleNum);
            if (articleEntity == null) return GetArticleResponseDto.noExistArticle();
            articleEntity.IncreaseViewCount();
            articleRepository.save(articleEntity);
        } catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetArticleResponseDto.success(articleEntity);
    }


    @Override
    public ResponseEntity<? super GetArticleListResponseDto> getArticleList() {
        List<Article> articleListViewEntities = new ArrayList<>();
        try{
            articleListViewEntities = artileListViewRepository.findAll();
        }catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetArticleListResponseDto.success(articleListViewEntities);
    }


    @Override
    public ResponseEntity<? super PutFavoriteResponseDto> putFavorite(Integer articleNum, String email) {

        Article articleEntity = null;
        try {
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return PutFavoriteResponseDto.notExistUser();

            articleEntity = articleRepository.findByArticleNum(articleNum);
            if (articleEntity == null) return PutFavoriteResponseDto.noExistArticle();

            FavoriteEntity favoriteEntity = favoriteRepository.findByArticleNumAndUserEmail(articleNum, email);
            if (favoriteEntity == null){
                favoriteEntity = new FavoriteEntity(email, articleNum);
                favoriteRepository.save(favoriteEntity);
                articleEntity.IncreaseFavoriteCount();
            }
            else{
                favoriteRepository.delete(favoriteEntity);
                articleEntity.decreaseFavoriteCount();
            }
            articleRepository.save(articleEntity);
        }catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return PutFavoriteResponseDto.success();
    }


    @Override
    public ResponseEntity<? super PostCommentResponseDto> postComment(PostCommentRequestDto dto, Integer articleNum,String email) {
        
        try{
            boolean existedArticle = articleRepository.existsByArticleNum(articleNum);
            if (!existedArticle) return PostCommentResponseDto.noExistArticle();
            boolean existedUser = userRepository.existsByEmail(email);
            if(!existedUser) return PostArticleResponseDto.notExistUser();
            CommentEntity commentEntity = new CommentEntity(dto, articleNum, email);
            commentRepository.save(commentEntity);
        } catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return PostCommentResponseDto.success(); }


    @Override
    public ResponseEntity<? super GetCommentListResponseDto> GetCommentList(Integer articleNum) {
        List<GetCommentListReultSet> resultSets = new ArrayList<>();

        try{
            boolean existedArticle = articleRepository.existsByArticleNum(articleNum);
            if(!existedArticle) return GetCommentListResponseDto.noExistArticle();

            resultSets = commentRepository.getCommentList(articleNum);
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetCommentListResponseDto.success(resultSets);
    }


    @Override
    public ResponseEntity<? super DeleteArticleResponseDto> deleteArticle(Integer articleNum,String email) {
        try{
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return DeleteArticleResponseDto.notExistUser();

            Article articleEntity = articleRepository.findByArticleNum(articleNum);
            if (articleEntity == null) return DeleteArticleResponseDto.noExistArticle();

            String writerEmail = articleEntity.getUserEmail();
            boolean isWriter = writerEmail.equals(email);
            if (!isWriter) return DeleteArticleResponseDto.noPermission();

            commentRepository.deleteByArticleNum(articleNum);
            favoriteRepository.deleteByArticleNum(articleNum);

            articleRepository.delete(articleEntity);


        }catch(Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return DeleteArticleResponseDto.success();
    }


    @Override
    public ResponseEntity<? super DeleteCommentResponseDto> deleteComment(Integer commentNumber, String email) {
        try{
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return DeleteCommentResponseDto.notExistUser();

            CommentEntity commentEntity = commentRepository.findByCommentNumber(commentNumber);

            String writerEmail = commentEntity.getUserEmail();
            boolean isWriter = writerEmail.equals(email);
            if (!isWriter) return DeleteArticleResponseDto.noPermission();

            commentRepository.delete(commentEntity);


        }catch(Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return DeleteCommentResponseDto.success();
    }


    @Override
    public ResponseEntity<? super PatchArticleResponseDto> patchArticle(PatchArticleRequestDto dto, Integer articleNum,
            String email) {
                try{
                    boolean existedUser = userRepository.existsByEmail(email);
                    if (!existedUser) return PatchArticleResponseDto.notExistUser();

                    Article articleEntity = articleRepository.findByArticleNum(articleNum);
                    if(articleEntity == null) return PatchArticleResponseDto.noExistArticle();

                    String wirterEmail = articleEntity.getUserEmail();
                    boolean isWriter = wirterEmail.equals(email);
                    if (!isWriter) return PatchArticleResponseDto.noPermission();

                    articleEntity.patchArticle(dto);
                    articleRepository.save(articleEntity);
        
                }catch(Exception exception){
                    exception.printStackTrace();
                    return ResponseDto.databaseError();
                }
                
                return PatchArticleResponseDto.success();
    }


    @Override
    public ResponseEntity<? super PatchCommentResponseDto> patchComment(PatchCommentRequestDto dto,
            Integer commentNumber, String email){
                try{
                    boolean existedUser = userRepository.existsByEmail(email);
                    if (!existedUser) return PatchCommentResponseDto.notExistUser();

                    CommentEntity commentEntity = commentRepository.findByCommentNumber(commentNumber);

                    String wirterEmail = commentEntity.getUserEmail();
                    boolean isWriter = wirterEmail.equals(email);
                    if (!isWriter) return PatchArticleResponseDto.noPermission();

                    commentEntity.patchComment(dto);
                    commentRepository.save(commentEntity);
        
                }catch(Exception exception){
                    exception.printStackTrace();
                    return ResponseDto.databaseError();
                }
                
                return PatchCommentResponseDto.success();
            }


    @Override
    public ResponseEntity<? super GetUserArticleListResponseDto> getUserArticleList(String email) {

        List<Article> articleListViewEntities = new ArrayList<>();

        try{

            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return GetUserArticleListResponseDto.noExistUser();

            articleListViewEntities = artileListViewRepository.findByUserEmailOrderByArticleDateDesc(email);

            

        }catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetUserArticleListResponseDto.success(articleListViewEntities);
    }

    // BanDuration 엔티티를 받아와 사용.
    private Period getPeriod(BanDuration banDuration) {
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


    @Override
    public ResponseEntity<? super CheckOwnOfArticleResponseDto> checkOwnArtcle(String email, Integer articleNum) {
        try{
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return CheckOwnOfArticleResponseDto.notExistUser();

            Article articleEntity = articleRepository.findByArticleNum(articleNum);
            if(articleEntity == null) return CheckOwnOfArticleResponseDto.noExistArticle();

            String wirterEmail = articleEntity.getUserEmail();
            boolean isWriter = wirterEmail.equals(email);
            if (!isWriter) return CheckOwnOfArticleResponseDto.noPermission();

        }catch(Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        
        return CheckOwnOfArticleResponseDto.success();
    }
}
