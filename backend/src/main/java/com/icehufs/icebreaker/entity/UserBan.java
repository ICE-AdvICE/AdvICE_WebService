package com.icehufs.icebreaker.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "userban")
@Getter
@Setter
public class UserBan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_email")
    private User user;

    @Enumerated(EnumType.STRING)
    private BanDuration banDuration;

    @Column(name = "ban_starttime")
    private LocalDateTime banStartTime;
}
