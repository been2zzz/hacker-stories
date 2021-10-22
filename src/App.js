import React from 'react';
import axios from 'axios';
import './App.css';

const title = 'React';
const welcome = {
  greeting:'hi',
  title:'react'
}
const initialStories = [
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
  );
    // new Promise((resolve, reject) => setTimeout(resolve, 2000));

// 리액트 커스텀 훅!!!!
const useSemiPersistentState = (key, initialState) =>{
  const [value, setValue] = React.useState(
    // localStorage.getItem('search') : 저장된 값이 존재하면 초기 상태 설정 사용
    // 'React' : 기본값
    localStorage.getItem(key) || initialState
    );
    
    // 첫번째 인수: 사이드 이펙트가 일어나는 함수 => 브라우저 로컬 저장소에 searchTerm 입력
    // 두번째 인수: 변수의 종속성 '배열'
    React.useEffect(() => {
      localStorage.setItem(key, value);
    }, [value, key]);

    // React.useState에 쓰일 value, setValue 반환
    return [value, setValue];
  };

function getTitle(){
  return title;
}
const stories = [
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
        data: action.payload
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORIES':
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

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search', 
    'React'
  );

  // 정적 API URL을 새로운 상태로 설정
  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  )

  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = event => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    // 브라우저를 다시 로드하는 HTML 폼 기본 동작 막기
    event.preventDefault();
  };

  // story를 비동기적으로 가져오기 위해 초기 상태 빈 배열
  // const [stories, setStories] = React.useState([]);
  // 첫 요소: 현재상태, 두번째 요소: 상태를 업데이트하는 함수
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    // 통합 상태 관리 및 더욱 복잡한 상태 개체를 위해 통합
    { data: [], isLoading: false, isError: false }
    );
    // loding 
    // const [isLoading, setIsLoading] = React.useState(false);
    // // error
    // const [isError, setIsError] = React.useState(false);
    
  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT'});

    try {
      const result = await axios.get(url);
      
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

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

  const handleRemoveStory = item => {
    // 삭제할 아이템을 인수로 하여 필터 조건을 충족하지 않는 모든 아이템 삭제
    // const newStories = stories.filter(
    //   story => item.objectID !== story.objectID
    // );
    dispatchStories({
      type: 'REMOVE_STORIES',
      payload: item,
    });
    // 살아남은 stories
    // console.log(newStories)
    // setStories(newStories);
  };
  
  const handleSearch = event =>{
    // 상태 변환 함수
    setSearchTerm(event.target.value);
    localStorage.setItem('search', event.target.value);
  };

  // const searchedStories = stories.data.filter(story =>
  //   // title 중 filter된 story만
  //   stories.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories</h1>
      
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      <hr/>
      {/* 조건이 참이면 && 뒷부분이 출력됨 거짓일 시 무시*/}
      {stories.isError && <p>Something went Wrong ...</p>}
      {stories.isLoading ? (
        <p>Loding...</p>
        ) : (
          <List 
            list={stories.data} 
            onRemoveItem={handleRemoveStory} />
      )}
    </div>
    );
  };

// SearchForm 컴포넌트 분리 
const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}) => (
  <form onSubmit={onSearchSubmit} className="search-form">
    <InputWithLabel 
      id="search"
      label="Search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search</strong>
    </InputWithLabel>
    <button 
      type="submit" 
      disabled={!searchTerm}
      className="button button_large"
    >
      Submit
    </button>
  </form>
);
// type='text' 함수 시그니처 기본 파라미터가 입력 필드를 대신함
const InputWithLabel = ({ 
  id, 
  value,
  type ='text', 
  onInputChange, 
  isFocused, 
  children,
}) => {
  const inputRef = React.useRef();
  // c
  React.useEffect(() => {
    if (isFocused && inputRef.current){
      // D
      inputRef.current.focus();
    }
  },[isFocused]);

  return (
    // A
    <>
      <label htmlFor={id} className="label">
        {children}
      </label>
      &nbsp;
      <input
        ref={inputRef} 
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};
const List = ({ list, onRemoveItem }) => 
  list.map(item => <Item
                      key={item.objectID} 
                      item={item}
                      onRemoveItem={onRemoveItem}
                    />);

const Item = ({ item, onRemoveItem }) => (
  <div className="item">
    {/* 인라인 스타일 */}
    <span style={{ width: '40%' }}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: '30%' }}>{item.author}</span>
    <span style={{ width: '10%' }}>{item.num_comments}</span>
    <span style={{ width: '10%' }}>{item.points}</span>
    <span style={{ width: '10%' }}>
      <button 
        type="button" 
        onClick={onRemoveItem.bind(null, item)}
        className="button button_small"
      >
        Dismiss
      </button>
    </span>
  </div>
);
// const Search = ({ search, onSearch }) => (
//   // 첫번째 : 현재 상태, 두번째: 이 상태를 업데이트하는 함수(상태 업데이트 함수)
//   // 배열 구조 분해
//     // fragment
//     <>  
//       <label htmlFor="search">Search: </label>
//       <input 
//         id="search" 
//         type="text" 
//         onChange={onSearch} 
//         value={search}/>
//       <p>Search for: <strong>{search}</strong></p>
//     </>
// );

export default App;