package com.icehufs.icebreaker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.entity.CourseScheduleEntity;
import com.icehufs.icebreaker.entity.primaryKey.CourseSchedPK;

@Repository
public interface CourseSchedulRepository extends JpaRepository<CourseScheduleEntity, CourseSchedPK> {



}
