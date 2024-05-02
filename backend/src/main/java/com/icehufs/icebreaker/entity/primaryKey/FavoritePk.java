package com.icehufs.icebreaker.entity.primaryKey;

import java.io.Serializable;

import javax.persistence.Column;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FavoritePk implements Serializable {
    @Column(name="user_email")
    private String userEmail;

    @Column(name="article_num")
    private int articleNum;

    
}
