package com.icehufs.icebreaker.service.implement;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.icehufs.icebreaker.dto.request.article.*;
import com.icehufs.icebreaker.dto.response.ResponseDto;
import com.icehufs.icebreaker.dto.response.article.*;
import com.icehufs.icebreaker.entity.Article;
import com.icehufs.icebreaker.entity.ArticleCategoryEnum;
import com.icehufs.icebreaker.entity.CommentEntity;
import com.icehufs.icebreaker.entity.FavoriteEntity;
import com.icehufs.icebreaker.repository.ArticleRepository;
import com.icehufs.icebreaker.repository.ArtileListViewRepository;
import com.icehufs.icebreaker.repository.CommentRepository;
import com.icehufs.icebreaker.repository.FavoriteRepository;
import com.icehufs.icebreaker.repository.UserRepository;
import com.icehufs.icebreaker.service.ArticleService;
import com.icehufs.icebreaker.util.EncryptionUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArticleServiceImplement implements ArticleService {

    private final ArtileListViewRepository artileListViewRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final FavoriteRepository favoriteRepository;
    
    @Override
    public ResponseEntity<? super PostArticleResponseDto> postArticle(PostArticleRequestDto dto, String email){
        try{
            // 사용자 계정이 존재하는지 확인하는 코드
            boolean existedEmail = userRepository.existsByEmail(email);
            if (!existedEmail) return PostArticleResponseDto.notExistUser();
            
            // 이메일 복호화 후 이메일 DB에 저장
            String encryptedEmail = EncryptionUtil.encrypt(email);
            Article articleEntity = new Article(dto, encryptedEmail); 

            //공지 게시글일때
            if (articleEntity.getCategory() == ArticleCategoryEnum.NOTIFICATION) return PostArticleResponseDto.validationFailed();

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
    public ResponseEntity<? super PostCommentResponseDto> postComment(PostCommentRequestDto dto, Integer articleNum, String email) {
        
        try{
            boolean existedArticle = articleRepository.existsByArticleNum(articleNum);
            if (!existedArticle) return PostCommentResponseDto.noExistArticle();

            // 사용자 계정이 존재하는지(로그인시간이 초과 됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if(!existedUser) return PostArticleResponseDto.notExistUser();

            // 댓글 이메일 복호화 처리
            String encryptedEmail = EncryptionUtil.encrypt(email);
            CommentEntity commentEntity = new CommentEntity(dto, articleNum, encryptedEmail);
            commentRepository.save(commentEntity);

        } catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return PostCommentResponseDto.success(); }


    @Override
    public ResponseEntity<? super GetCommentListResponseDto> GetCommentList(Integer articleNum) {
        List<CommentEntity> resultSets = new ArrayList<>();

        try{
            boolean existedArticle = articleRepository.existsByArticleNum(articleNum);
            if(!existedArticle) return GetCommentListResponseDto.noExistArticle();

            resultSets = commentRepository.findByArticleNumOrderByWriteDatetimeDesc(articleNum);
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetCommentListResponseDto.success(resultSets);
    }


    @Override
    public ResponseEntity<? super DeleteArticleResponseDto> deleteArticle(Integer articleNum, String email) {
        try{
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return DeleteArticleResponseDto.notExistUser();

            Article articleEntity = articleRepository.findByArticleNum(articleNum);
            if (articleEntity == null) return DeleteArticleResponseDto.noExistArticle();

            // 일치 여부를 확인하기 위한 게시글 이메일 복호화 처리
            String decryptedWriterEmail = EncryptionUtil.decrypt(articleEntity.getUserEmail());
            boolean isWriter = decryptedWriterEmail.equals(email);
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

            // 사용자 계정이 존재하는지(로그인시간이 초과 됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email); 
            if (!existedUser) return DeleteCommentResponseDto.notExistUser();

            // 댓글이 존재하지않는 경우
            CommentEntity commentEntity = commentRepository.findByCommentNumber(commentNumber);
            if (commentEntity == null) return DeleteCommentResponseDto.noExistComment();

            // 일치 여부를 확인하기 위한 댓글 이메일 복호화 처리
            String decryptedWriterEmail = EncryptionUtil.decrypt(commentEntity.getUserEmail());
            boolean isWriter = decryptedWriterEmail.equals(email);
            if (!isWriter) return DeleteArticleResponseDto.noPermission();

            commentRepository.delete(commentEntity);


        }catch(Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return DeleteCommentResponseDto.success();
    }


    @Override
    public ResponseEntity<? super PatchArticleResponseDto> patchArticle(PatchArticleRequestDto dto, Integer articleNum, String email) {
        try{
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return PatchArticleResponseDto.notExistUser();

            Article articleEntity = articleRepository.findByArticleNum(articleNum);
            if(articleEntity == null) return PatchArticleResponseDto.noExistArticle();

            // 일치 여부를 확인하기 위한 게시글 이메일 복호화 처리
            String decryptedWriterEmail = EncryptionUtil.decrypt(articleEntity.getUserEmail());
            boolean isWriter = decryptedWriterEmail.equals(email);
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
    public ResponseEntity<? super PatchCommentResponseDto> patchComment(PatchCommentRequestDto dto, Integer commentNumber, String email){
        try{
            // 사용자 계정이 존재하는지(로그인시간이 초과 됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return PatchCommentResponseDto.notExistUser();

            CommentEntity commentEntity = commentRepository.findByCommentNumber(commentNumber);

            // 일치 여부를 확인하기 위한 댓글 이메일 복호화 처리
            String decryptedWriterEmail = EncryptionUtil.decrypt(commentEntity.getUserEmail());
            boolean isWriter = decryptedWriterEmail.equals(email);
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

            String encryptedEmail = EncryptionUtil.encrypt(email);
            articleListViewEntities = artileListViewRepository.findByUserEmailOrderByArticleDateDesc(encryptedEmail);

        }catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetUserArticleListResponseDto.success(articleListViewEntities);
    }

    @Override
    public ResponseEntity<? super CheckOwnOfArticleResponseDto> checkOwnArtcle(String email, Integer articleNum) {
        try{
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return CheckOwnOfArticleResponseDto.notExistUser();

            Article articleEntity = articleRepository.findByArticleNum(articleNum);
            if(articleEntity == null) return CheckOwnOfArticleResponseDto.noExistArticle();

            // 일치 여부를 확인하기 위한 게시글 이메일 복호화 처리
            String decryptedWriterEmail = EncryptionUtil.decrypt(articleEntity.getUserEmail());
            boolean isWriter = decryptedWriterEmail.equals(email);
            if (!isWriter) return CheckOwnOfArticleResponseDto.noPermission();

        }catch(Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        
        return CheckOwnOfArticleResponseDto.success();
    }
    
    @Override
    public ResponseEntity<? super CheckArticleFavoriteResponseDto> checkFavorite(Integer articleNum, String email) {
        try {
            FavoriteEntity favoriteEntity = favoriteRepository.findByArticleNumAndUserEmail(articleNum, email);
            if (favoriteEntity == null) return CheckArticleFavoriteResponseDto.notFavorite();

        }catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return CheckArticleFavoriteResponseDto.success();
    }


    @Override
    public ResponseEntity<? super DeleteArticleAdminResponseDto> deleteArticleAdmin(Integer articleNum, String email) {
        try{
            // 사용자 계정이 존재하는지(로그인시간이 초과 됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return CheckOwnOfArticleResponseDto.notExistUser();

            Article articleEntity = articleRepository.findByArticleNum(articleNum);
            if (articleEntity == null) return DeleteArticleAdminResponseDto.noExistArticle();

            commentRepository.deleteByArticleNum(articleNum);
            favoriteRepository.deleteByArticleNum(articleNum);
            articleRepository.delete(articleEntity);

        }catch(Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return DeleteArticleAdminResponseDto.success();
    }


    @Override
    public ResponseEntity<? super PutResolvedArticleResponseDto> putResolv(Integer articleNum, String email) {
        Article articleEntity = null;
        try {
            // 사용자 계정이 존재하는지(로그인시간이 초과 됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return CheckOwnOfArticleResponseDto.notExistUser();

            articleEntity = articleRepository.findByArticleNum(articleNum);
            if (articleEntity == null) return PutResolvedArticleResponseDto.noExistArticle();

            articleEntity.putResolv();
            articleRepository.save(articleEntity);

        }catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return PutResolvedArticleResponseDto.success();
    }


    @Override
    public ResponseEntity<? super PostArticleResponseDto> postArticleNotif(PostArticleRequestDto dto, String email) {
        try{
            // 사용자 계정이 존재하는지(로그인시간이 초과 됐는지) 확인하는 코드
            boolean existedEmail = userRepository.existsByEmail(email);
            if (!existedEmail) return PostArticleResponseDto.notExistUser();

            // 이메일 암호화 처리
            String encryptedEmail = EncryptionUtil.encrypt(email);
            Article articleEntity = new Article(dto, encryptedEmail);

            //공지 게시글 아닐때
            if (articleEntity.getCategory() == ArticleCategoryEnum.GENERAL || articleEntity.getCategory() == ArticleCategoryEnum.REQUEST) {
                return PostArticleResponseDto.validationFailed();
            }

            articleRepository.save(articleEntity);

        }catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return PostArticleResponseDto.success();
    }
}