import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getQuestions } from '../api';
import DateText from '../components/DateText';
import ListPage from '../components/ListPage';
import Warn from '../components/Warn';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import styles from './QuestionListPage.module.css';
import searchBarStyles from '../components/SearchBar.module.css';
import searchIcon from '../assets/search.svg';

function QuestionItem({ question }) {
  return (
    <Card className={styles.questionItem} key={question.title}>
      <div className={styles.info}>
        <p className={styles.title}>
          <Link to={`/questions/${question.id}`}>{question.title}</Link>
          {question.answers.length > 0 && (
            <span className={styles.count}>[{question.answers.length}]</span>
          )}
        </p>
        <p className={styles.date}>
          <DateText value={question.createdAt} />
        </p>
      </div>
      <div className={styles.writer}>
        <Avatar
          photo={question.writer.profile.photo}
          name={question.writer.name}
        />
      </div>
    </Card>
  );
}

function QuestionListPage() {
  const [searchParams, setSearchParams] = useSearchParams(); // 현재 URL의 쿼리 파라미터 스테이트
  const initKeywordValue = searchParams.get('keywordKey'); // 현재 URL의 쿼리 파라미터 스테이트 중 keyword 파라미터의 값
  const [keywordValue, setKeywordValue] = useState(initKeywordValue || ''); // keyword 파라미터의 값을 keyword 스테이트의 초기값으로 설정
  const questions = getQuestions(initKeywordValue); // keyword 파라미터의 값을 가져와 검색 결과 getQuestions 호출

  const handleKeywordChange = (e) => setKeywordValue(e.target.value); // keyword 스테이트를 이벤트 value로 변경

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(keywordValue ? { keywordKey: keywordValue } : {}); // { keyword: keyword }로, keyword 스테이트를 쿼리 파라미터의 값으로 해 업데이트!!
  };

  return (
    <ListPage
      variant="community"
      title="커뮤니티"
      description="코드댓의 2만 수강생들과 함께 공부해봐요."
    >
      <form className={searchBarStyles.form} onSubmit={handleSubmit}>
        <input
          name="keywordKey"
          value={keywordValue}
          placeholder="검색으로 질문 찾기"
          onChange={handleKeywordChange}
        />
        <button type="submit">
          <img src={searchIcon} alt="검색" />
        </button>
      </form>

      <p className={styles.count}>총 {questions.length}개 질문</p>

      {initKeywordValue && questions.length === 0 ? (
        <Warn
          className={styles.emptyList}
          title="조건에 맞는 질문이 없어요."
          description="올바른 검색어가 맞는지 다시 한 번 확인해 주세요."
        />
      ) : (
        <div className={styles.questionList}>
          {questions.map((question) => (
            <QuestionItem key={question.id} question={question} />
          ))}
        </div>
      )}
    </ListPage>
  );
}

export default QuestionListPage;
