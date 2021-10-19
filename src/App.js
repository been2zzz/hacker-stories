import React from 'react';

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
const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search', 
    'React'
  );
  // story를 비동기적으로 가져오기 위해 초기 상태 빈 배열
  const [stories, setStories] = React.useState([]);
  
  React.useEffect(() => {
    getAsyncStories().then(result => {
      setStories(result.data.stories);
    })
  }, []);

  const handleRemoveStory = item => {
    // 삭제할 아이템을 인수로 하여 필터 조건을 충족하지 않는 모든 아이템 삭제
    const newStories = stories.filter(
      story => item.objectID !== story.objectID
    );
    // 살아남은 stories
    console.log(newStories)
    setStories(newStories);
  };
  // A
  const handleSearch = event =>{
    // C 상태 변환 함수
    setSearchTerm(event.target.value);
    localStorage.setItem('search', event.target.value);
  };

  const searchedStories = stories.filter(function(story){
    // title 중 filter된 story만
    return story.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });
  return (
    <div>
      <h1>Hello {title}</h1>
      {/* 객체 */}
      <h1> 
        {welcome.greeting} {welcome.title}
      </h1>
      {/* 함수 사용 */}
      <h1>Hello {getTitle('React')}</h1>

      <InputWithLabel 
        id="search"
        label="Search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search</strong>
      </InputWithLabel>
      <hr/>
      <List list={searchedStories} onRemoveItem={handleRemoveStory} />
    </div>
    );
  };
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
        <label htmlFor={id}>{children}</label>
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

const Item = ({ item, onRemoveItem }) => {
  const handleRemoveItem = () => {
    onRemoveItem(item);
  };
    
  return (
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={onRemoveItem.bind(null, item)}>
          Dismiss
        </button>
      </span>
    </div>
  );
};
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