import { useState } from 'react';
import ListPage from '../components/ListPage';
import Warn from '../components/Warn';
import CourseItem from '../components/CourseItem';
import { getCourses } from '../api';
import styles from './CourseListPage.module.css';
import searchBarStyles from '../components/SearchBar.module.css';
import searchIcon from '../assets/search.svg';
import { useSearchParams } from 'react-router-dom';

function CourseListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initKeyword = searchParams.get('keyword'); // 쿼리 파라미터(검색어) 가져오기
  const [keyword, setKeyword] = useState(initKeyword || ''); // input에 value로 줄 것이기 때문에 문자열이어야 함!
  const courses = getCourses(initKeyword); // 검색 결과

  const handleKeywordChange = (e) => setKeyword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault(); // submit 했을 때 자동 페이지 이동 방지
    setSearchParams(
      // 쿼리 파라미터 값 변경 - 주소창의 쿼리 스트링 변경 (객체 프로퍼티로 전달)
      keyword
        ? {
            keyword,
          }
        : {}
    );
  };

  return (
    <ListPage
      variant="catalog"
      title="모든 코스"
      description="자체 제작된 코스들로 기초를 쌓으세요."
    >
      <form className={searchBarStyles.form} onSubmit={handleSubmit}>
        <input
          name="keyword"
          value={keyword}
          onChange={handleKeywordChange}
          placeholder="검색으로 코스 찾기"
        ></input>
        <button type="submit">
          <img src={searchIcon} alt="검색" />
        </button>
      </form>

      <p className={styles.count}>총 {courses.length}개 코스</p>

      {initKeyword && courses.length === 0 ? ( // 검색어가 있고, courses(검색어 결과)가 0일 때
        <Warn
          className={styles.emptyList}
          title="조건에 맞는 코스가 없어요."
          descr
          iption="올바른 검색어가 맞는지 다시 한 번 확인해 주세요."
        />
      ) : (
        <div className={styles.courseList}>
          {courses.map((course) => (
            <CourseItem key={course.id} course={course} />
          ))}
        </div>
      )}
    </ListPage>
  );
}

export default CourseListPage;
