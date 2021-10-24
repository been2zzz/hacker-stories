import React from 'react';
import axios from 'axios';

import SearchForm from './SearchForm';
import List from './List';

import styled from 'styled-components';
const StyledContainer = styled.div`
  padding: 20px;
  color: #171212;
`;

const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;
const StyledButton = styled.button`
  background: transparent;
  border: 1px solid #171212;
  padding: 5px;
  margin-left: 5px;
  cursor: pointer;
  transition: all 0.1s ease-in;
  border-radius: 40%;
  &:hover {
    background: #171212;
    color: #ffffff;
  }
`;

const API_BASE = 'https://hn.algolia.com/api/v1';
const API_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

const getUrl = (searchTerm, page) => 
  `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

// url에서 searchTerm만 추출
const extractSearchTerm = url =>
  url
    .substring(url.lastIndexOf('?') + 1, url.lastIndexOf('&')) // query=react
    .replace(PARAM_SEARCH, ''); // react

const getLastSearches = urls => 
urls // 빈 배열 result  
  .reduce((result, url, index) => {
    const searchTerm = extractSearchTerm(url);
    
    if (index === 0) {
      return result.concat(searchTerm);
    }
    
    const previousSearchTerm = result[result.length -1];
    
    if (searchTerm === previousSearchTerm) {
      return result;
    } else {
      return result.concat(searchTerm);
    }
    }, [])
  .slice(-6)
  .slice(0, -1)
  .map(extractSearchTerm);

{const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const getAsyncStories = () =>
  new Promise(resolve =>
    setTimeout(
      () => resolve({ data: {stories: initialStories } }),
      2000
    )
  );}
    // new Promise((resolve, reject) => setTimeout(resolve, 2000));

// 리액트 커스텀 훅!!!!
const useSemiPersistentState = (key, initialState) =>{
  // 첫 렌더링에서 사이드이펙트 실행은 불필요
  // useRef 훅을 사용하여 첫 렌더링 사이드이펙트 막기
  const isMounted = React.useRef(false);

  const [value, setValue] = React.useState(
    // localStorage.getItem('search') : 저장된 값이 존재하면 초기 상태 설정 사용
    // 'React' : 기본값
    localStorage.getItem(key) || initialState
    );
    
    // 첫번째 인수: 사이드 이펙트가 일어나는 함수 => 브라우저 로컬 저장소에 searchTerm 입력
    // 두번째 인수: 변수의 종속성 '배열'
    React.useEffect(() => {
      if (!isMounted.current) {
        isMounted.current = true;
      } else {
        localStorage.setItem(key, value);
      }
    }, [value, key]);

    // React.useState에 쓰일 value, setValue 반환
    return [value, setValue];
  };

const storiesReducer = (state, action) => {
  console.log(action.payload) // 초기엔 stories 배열, dismiss 클릭 경우 클릭된 배열이 들어감
  switch (action.type){
    case 'STORIES_FETCH_INIT':
      return {
        // 기존 state 객체 값 유지(불변성)를 위해 객체 복사
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: 
          action.payload.page === 0
            ? action.payload.list
            : state.data.concat(action.payload.list),
        page: action.payload.page,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
}

const getSumComments = stories => {
  return stories.data.reduce(
    (result, value) => result + value.num_comments,
    0
  );
};

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search', 
    'React'
  );
  
  // 정적 API URL을 새로운 상태로 설정
  const [urls, setUrls] = React.useState([getUrl(searchTerm, 0)]);
  
  // story를 비동기적으로 가져오기 위해 초기 상태 빈 배열
  // const [stories, setStories] = React.useState([]);
  // 첫 요소: 현재상태, 두번째 요소: 상태를 업데이트하는 함수
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    // 통합 상태 관리 및 더욱 복잡한 상태 개체를 위해 통합
    { data: [], page: 0, isLoading: false, isError: false }
  );
  
  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT'});

    try {
      const lastUrl = urls[urls.length -1];
      const result = await axios.get(lastUrl);
      
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload:{
          list: result.data.hits,
          page: result.data.page,
        }, 
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
    }
  }, [urls]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

   // useCallback 훅을 사용하여 (종속성 중 하나가 변경된 경우) 리렌더링에만 함수를 생성하도록!
  const handleRemoveStory = React.useCallback(item => {
    // 삭제할 아이템을 인수로 하여 필터 조건을 충족하지 않는 모든 아이템 삭제
    // const newStories = stories.filter(
    //   story => item.objectID !== story.objectID
    // );
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
    // 살아남은 stories
    // console.log(newStories)
    // setStories(newStories);
  }, []);
  
  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };
  
  const handleSearchSubmit = event => {
    handleSearch(searchTerm, 0);
    // 브라우저를 다시 로드하는 HTML 폼 기본 동작 막기
    event.preventDefault();
  };

  const handleLastSearch = searchTerm => {
    setSearchTerm(searchTerm); // searchTerm 업데이트

    handleSearch(searchTerm, 0); // urls 배열 concat 
  };

  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm, stories.page + 1);
  };

  const handleSearch = (searchTerm, page) =>{
    const url = getUrl(searchTerm, page);
    setUrls(urls.concat(url));
    // 상태 변환 함수
    // setSearchTerm(event.target.value);
    // localStorage.setItem('search', event.target.value);
  };

  const lastSearches = getLastSearches(urls);
    
  const sumComments = React.useMemo(() => getSumComments(stories), [
    stories,
  ]);
  
    // getAsyncStories()
    //   .then(result => {
    //     dispatchStories({
    //       type: 'STORIES_FETCH_SUCCESS',
    //       payload: result.data.stories,
    //     });
    //   // setStories(result.data.stories);
    //   // data를 가져온 후 false 처리
    //   // setIsLoading(false);
    // })
    //   .catch(() =>
    //     dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
    //   );
  // }, [searchTerm]);

  // const searchedStories = stories.data.filter(story =>
  //   // title 중 filter된 story만
  //   stories.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  return (
    // CSS 모듈 사용시 JSX표현식 사용하여 엘리먼트 할당
    <StyledContainer>
      <StyledHeadlinePrimary>My Hacker Stories with {sumComments} comments</StyledHeadlinePrimary>
      
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      <LastSearches
        lastSearches={lastSearches}
        onLastSearch={handleLastSearch}
      />
      <hr/>
      <List 
          list={stories.data} 
          onRemoveItem={handleRemoveStory} />
      {stories.isLoading ? (
        <p>Loding...</p>
        ) : (
          <StyledButton type="button" onClick={handleMore}>
            More
          </StyledButton>
          )}
      {/* 조건이 참이면 && 뒷부분이 출력됨 거짓일 시 무시*/}
      {stories.isError && <p>Something went Wrong ...</p>}
    </StyledContainer>
    );
  };

const LastSearches = ({ lastSearches, onLastSearch }) => (
  <>
  <span>Last Search Term</span>
  {lastSearches.map((searchTerm, index) => (
    <StyledButton
      key={searchTerm + index}
      type="button"
      onClick={() => onLastSearch(searchTerm)}
    >
      {searchTerm}
    </StyledButton>
  ))}
  </>
);

export default App;