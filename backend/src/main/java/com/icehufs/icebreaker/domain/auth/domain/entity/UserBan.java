package com.icehufs.icebreaker.domain.auth.domain.entity;

import java.time.LocalDateTime;

import com.icehufs.icebreaker.domain.auth.domain.type.BanDurationEnum;
import com.icehufs.icebreaker.domain.auth.domain.type.BanReasonEnum;
import com.icehufs.icebreaker.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "userban")
public class UserBan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email")
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "ban_duration")
    private BanDurationEnum banDuration;

    @Column(name = "ban_starttime")
    private LocalDateTime banStartTime;

    @Column(name = "ban_endtime")
    private LocalDateTime banEndTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "ban_reason")
    private BanReasonEnum banReason;

    @ManyToOne
    @JoinColumn(name = "user_email", referencedColumnName = "user_email", insertable = false, updatable = false, foreignKey = @ForeignKey(name = "fk_user_email"))
    private User user;

    public UserBan(String email, BanDurationEnum banDuration, LocalDateTime banStartTime, LocalDateTime banEndTime, BanReasonEnum banReason) {
        this.email = email;
        this.banDuration = banDuration;
        this.banStartTime = banStartTime;
        this.banEndTime = banEndTime;
        this.banReason = banReason;
    }
}
